
-- ==========================================
-- COFFEE MACHINES HUB - REPEATABLE SETUP SQL
-- ==========================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. TABLES
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

-- Profiles linked to auth.users
create table if not exists profiles (
  id uuid references auth.users not null primary key,
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

-- 3. RLS ENABLE
alter table products enable row level security;
alter table blogs enable row level security;
alter table testimonials enable row level security;
alter table content enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table messages enable row level security;

-- 4. POLICIES (DROP & RECREATE)
do $$ 
begin
    -- Products
    execute 'drop policy if exists "Public Read Products" on products';
    execute 'drop policy if exists "Admin Write Products" on products';
    
    -- Blogs
    execute 'drop policy if exists "Public Read Blogs" on blogs';
    execute 'drop policy if exists "Admin Write Blogs" on blogs';
    
    -- Testimonials
    execute 'drop policy if exists "Public Read Testimonials" on testimonials';
    execute 'drop policy if exists "Admin Write Testimonials" on testimonials';
    
    -- Content
    execute 'drop policy if exists "Public Read Content" on content';
    execute 'drop policy if exists "Admin Write Content" on content';
    
    -- Profiles
    execute 'drop policy if exists "Read Profiles" on profiles';
    execute 'drop policy if exists "Update Profiles" on profiles';
    execute 'drop policy if exists "Insert Profiles" on profiles';
    
    -- Orders
    execute 'drop policy if exists "Read Orders" on orders';
    execute 'drop policy if exists "Public Create Orders" on orders';
    execute 'drop policy if exists "Admin Manage Orders" on orders';
    
    -- Messages
    execute 'drop policy if exists "Public Create Messages" on messages';
    execute 'drop policy if exists "Admin Manage Messages" on messages';
    execute 'drop policy if exists "Admin Delete Messages" on messages';
    execute 'drop policy if exists "Admin Update Messages" on messages';
end $$;

-- Create Policies

-- Products
create policy "Public Read Products" on products for select using (true);
create policy "Admin Write Products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Blogs
create policy "Public Read Blogs" on blogs for select using (true);
create policy "Admin Write Blogs" on blogs for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Testimonials
create policy "Public Read Testimonials" on testimonials for select using (true);
create policy "Admin Write Testimonials" on testimonials for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Content
create policy "Public Read Content" on content for select using (true);
create policy "Admin Write Content" on content for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Profiles
create policy "Read Profiles" on profiles for select using (
  auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Update Profiles" on profiles for update using (
  auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Insert Profiles" on profiles for insert with check (auth.uid() = id);

-- Orders
create policy "Public Create Orders" on orders for insert with check (true);
create policy "Read Orders" on orders for select using (
  (auth.jwt() ->> 'email') = email OR exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin Manage Orders" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Messages
create policy "Public Create Messages" on messages for insert with check (true);
create policy "Admin Manage Messages" on messages for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin Delete Messages" on messages for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin Update Messages" on messages for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 5. STORAGE
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
    execute 'drop policy if exists "Admin Write Images" on storage.objects';
    execute 'drop policy if exists "Admin Update Images" on storage.objects';
    execute 'drop policy if exists "Admin Delete Images" on storage.objects';
end $$;

create policy "Public Read Images" on storage.objects for select using ( bucket_id in ('products', 'content', 'blogs', 'categories', 'team') );

create policy "Admin Write Images" on storage.objects for insert with check (
  bucket_id in ('products', 'content', 'blogs', 'categories', 'team') 
  and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin Update Images" on storage.objects for update using (
  bucket_id in ('products', 'content', 'blogs', 'categories', 'team') 
  and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Admin Delete Images" on storage.objects for delete using (
  bucket_id in ('products', 'content', 'blogs', 'categories', 'team') 
  and exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- 6. TRIGGERS
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow recreation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. ADMIN BOOTSTRAP
-- Safely attempts to make the specified user an admin IF they exist in auth.users
do $$
declare
  target_email text := 'salmangbob@gmail.com';
  admin_uid uuid;
begin
  -- Find user ID from auth.users (requires permission context that setup scripts usually have)
  select id into admin_uid from auth.users where email = target_email limit 1;
  
  if admin_uid is not null then
    -- Upsert profile with admin role
    insert into public.profiles (id, email, role, name)
    values (admin_uid, target_email, 'admin', 'Super Admin')
    on conflict (id) do update 
    set role = 'admin';
  end if;
end $$;
