
-- ==========================================
-- COFFEE MACHINES HUB - MASTER SETUP SCRIPT
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES (Idempotent Creation)
create table if not exists products (
  id text primary key,
  title text not null,
  price numeric default 0,
  image text,
  images text[],
  "hoverImage" text,
  "hoverVideo" text,
  category text,
  tags text[],
  "soldOut" boolean default false,
  "isFeatured" boolean default false,
  "isRecommended" boolean default false,
  subtitle text,
  "roastLevel" text,
  origin text,
  description text,
  features jsonb
);

create table if not exists blogs (
  id text primary key,
  title text,
  excerpt text,
  content text,
  date text,
  image text,
  author text,
  "sourceLink" text
);

create table if not exists testimonials (
  id text primary key,
  name text,
  role text,
  text text,
  rating numeric
);

create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  date text,
  name text,
  email text,
  message text,
  read boolean default false
);

create table if not exists orders (
  id text primary key,
  date text,
  "customerName" text,
  email text,
  address text,
  phone text,
  total numeric,
  status text,
  items jsonb
);

create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  role text default 'customer',
  wishlist text[] default '{}',
  cart jsonb default '[]',
  phone text,
  address text,
  city text
);

create table if not exists content (
  key text primary key,
  data jsonb
);

-- 3. HELPER FUNCTIONS (CRITICAL FIX FOR RECURSION)
-- This function runs with the privileges of the creator (postgres/superuser)
-- allowing it to bypass RLS on the profiles table to check role.
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 4. CLEANUP & POLICIES
-- We drop existing policies to ensure a clean slate (idempotency)

do $$ 
declare
  tables text[] := array['products', 'blogs', 'testimonials', 'content', 'profiles', 'orders', 'messages'];
  t text;
begin
  foreach t in array tables loop
    -- Enable RLS
    execute format('alter table %I enable row level security', t);
    
    -- Drop potential existing policies to prevent "already exists" errors
    execute format('drop policy if exists "Public Read %s" on %I', t, t);
    execute format('drop policy if exists "Admin Manage %s" on %I', t, t);
    execute format('drop policy if exists "Read %s" on %I', t, t);
    execute format('drop policy if exists "Update %s" on %I', t, t);
    execute format('drop policy if exists "Insert %s" on %I', t, t);
    execute format('drop policy if exists "Delete %s" on %I', t, t);
    execute format('drop policy if exists "Users read own %s" on %I', t, t);
  end loop;
end $$;

-- --- PRODUCTS ---
create policy "Public Read products" on products for select using (true);
create policy "Admin Manage products" on products for all using ( is_admin() );

-- --- BLOGS ---
create policy "Public Read blogs" on blogs for select using (true);
create policy "Admin Manage blogs" on blogs for all using ( is_admin() );

-- --- TESTIMONIALS ---
create policy "Public Read testimonials" on testimonials for select using (true);
create policy "Admin Manage testimonials" on testimonials for all using ( is_admin() );

-- --- CONTENT ---
create policy "Public Read content" on content for select using (true);
create policy "Admin Manage content" on content for all using ( is_admin() );

-- --- PROFILES ---
-- Users can read their own profile. Admins can read all.
create policy "Read profiles" on profiles for select using (
  auth.uid() = id OR is_admin()
);
-- Users can update their own profile. Admins can update all.
create policy "Update profiles" on profiles for update using (
  auth.uid() = id OR is_admin()
);
-- Profiles are inserted via Trigger (system) or Admin. 
-- We allow users to insert their own profile just in case the trigger fails/race condition.
create policy "Insert profiles" on profiles for insert with check (
  auth.uid() = id OR is_admin()
);
create policy "Delete profiles" on profiles for delete using ( is_admin() );

-- --- ORDERS ---
-- Anyone (authenticated) can create an order
create policy "Create orders" on orders for insert with check ( auth.role() = 'authenticated' );
-- Users see their own orders (by email match). Admins see all.
create policy "Read orders" on orders for select using (
  (auth.jwt() ->> 'email') = email OR is_admin()
);
create policy "Admin Manage orders" on orders for all using ( is_admin() );

-- --- MESSAGES ---
create policy "Create messages" on messages for insert with check (true);
create policy "Admin Manage messages" on messages for all using ( is_admin() );

-- 5. STORAGE BUCKETS
insert into storage.buckets (id, name, public) 
values 
  ('products', 'products', true),
  ('content', 'content', true),
  ('blogs', 'blogs', true),
  ('categories', 'categories', true),
  ('team', 'team', true)
on conflict (id) do update set public = excluded.public;

-- Storage Policies
do $$ 
begin
    execute 'drop policy if exists "Public Read Images" on storage.objects';
    execute 'drop policy if exists "Admin Manage Images" on storage.objects';
end $$;

-- Public Read
create policy "Public Read Images" on storage.objects for select using ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') );

-- Admin Write/Delete
create policy "Admin Manage Images" on storage.objects for all using (
  bucket_id in ('products', 'content', 'blogs', 'categories', 'team') 
  and is_admin()
);

-- 6. TRIGGERS (Auto-create profile on signup)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. ADMIN BOOTSTRAP
-- Sets a specific email as admin immediately
do $$
declare
  target_email text := 'salmangbob@gmail.com'; 
  admin_uid uuid;
begin
  select id into admin_uid from auth.users where email = target_email limit 1;
  
  if admin_uid is not null then
    -- Ensure profile exists
    insert into public.profiles (id, email, role, name)
    values (admin_uid, target_email, 'admin', 'Super Admin')
    on conflict (id) do update 
    set role = 'admin';
  end if;
end $$;
