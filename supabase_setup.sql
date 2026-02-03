
-- ==========================================
-- COFFEE MACHINES HUB - ROBUST RE-RUNNABLE SCRIPT
-- RUN THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- ==========================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Tables (Idempotent - only creates if missing)
create table if not exists public.products (
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

create table if not exists public.blogs (
  id text primary key,
  title text,
  excerpt text,
  content text,
  date text,
  image text,
  author text,
  "sourceLink" text
);

create table if not exists public.testimonials (
  id text primary key,
  name text,
  role text,
  text text,
  rating numeric
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  date text,
  name text,
  email text,
  message text,
  read boolean default false
);

create table if not exists public.orders (
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

create table if not exists public.profiles (
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

create table if not exists public.content (
  key text primary key,
  data jsonb
);

-- 3. ENABLE RLS ON ALL TABLES
alter table public.products enable row level security;
alter table public.blogs enable row level security;
alter table public.testimonials enable row level security;
alter table public.content enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;

-- 4. FIX ADMIN FUNCTION
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

-- 5. NUKE EXISTING PUBLIC TABLE POLICIES
do $$ 
declare
  t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('drop policy if exists "Public Read" on public.%I', t);
    execute format('drop policy if exists "Admin All" on public.%I', t);
    execute format('drop policy if exists "Admin Manage" on public.%I', t);
    execute format('drop policy if exists "Users Read Own" on public.%I', t);
    execute format('drop policy if exists "Public Insert" on public.%I', t);
    execute format('drop policy if exists "Self Update" on public.%I', t);
    execute format('drop policy if exists "Self Insert" on public.%I', t);
  end loop;
end $$;

-- 6. RE-APPLY POLICIES

-- === CONTENT ===
create policy "Public Read" on public.content for select using (true);
create policy "Admin Manage" on public.content for all using (is_admin());

-- === PRODUCTS ===
create policy "Public Read" on public.products for select using (true);
create policy "Admin Manage" on public.products for all using (is_admin());

-- === BLOGS ===
create policy "Public Read" on public.blogs for select using (true);
create policy "Admin Manage" on public.blogs for all using (is_admin());

-- === TESTIMONIALS ===
create policy "Public Read" on public.testimonials for select using (true);
create policy "Admin Manage" on public.testimonials for all using (is_admin());

-- === MESSAGES ===
create policy "Public Insert" on public.messages for insert with check (true);
create policy "Admin Manage" on public.messages for all using (is_admin());

-- === ORDERS ===
create policy "Public Insert" on public.orders for insert with check (true);
create policy "Users Read Own" on public.orders for select using ( (auth.jwt() ->> 'email') = email OR is_admin() );
create policy "Admin Manage" on public.orders for all using (is_admin());

-- === PROFILES ===
create policy "Public Read" on public.profiles for select using (true);
create policy "Self Update" on public.profiles for update using ( auth.uid() = id OR is_admin() );
create policy "Self Insert" on public.profiles for insert with check ( auth.uid() = id OR is_admin() );

-- 7. STORAGE CONFIGURATION
insert into storage.buckets (id, name, public) 
values 
  ('products', 'products', true),
  ('content', 'content', true),
  ('blogs', 'blogs', true),
  ('categories', 'categories', true),
  ('team', 'team', true)
on conflict (id) do update set public = true;

-- CLEANUP STORAGE POLICIES BEFORE CREATING
do $$ 
begin
    execute 'drop policy if exists "Public Read Images" on storage.objects';
    execute 'drop policy if exists "Admin Manage Images" on storage.objects';
    execute 'drop policy if exists "Admin Update Images" on storage.objects';
    execute 'drop policy if exists "Admin Delete Images" on storage.objects';
end $$;

-- CREATE STORAGE POLICIES
create policy "Public Read Images" on storage.objects for select using ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') );
create policy "Admin Manage Images" on storage.objects for insert with check ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') and is_admin() );
create policy "Admin Update Images" on storage.objects for update using ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') and is_admin() );
create policy "Admin Delete Images" on storage.objects for delete using ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') and is_admin() );

-- 8. TRIGGER FOR NEW USERS
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

-- 9. SET ADMIN
do $$
begin
  update public.profiles 
  set role = 'admin' 
  where email = 'salmangbob@gmail.com'; 
end $$;
