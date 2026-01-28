
-- ==========================================
-- COFFEE MACHINES HUB - REPEATABLE SETUP SQL
-- ==========================================

-- 1. EXTENSIONS
-- Enable standard UUID generation
create extension if not exists "uuid-ossp";

-- 2. TABLES
-- Use "IF NOT EXISTS" to make the script repeatable without errors

-- Products
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

-- Blogs
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

-- Testimonials
create table if not exists testimonials (
  id text primary key,
  name text,
  role text,
  text text,
  rating numeric
);

-- Messages
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  date text,
  name text,
  email text,
  message text,
  read boolean default false
);

-- Orders
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

-- Profiles (Users)
-- Note: 'auth.users' is a system table. We reference it here.
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

-- Content (Site Settings)
create table if not exists content (
  key text primary key,
  data jsonb
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- We drop existing policies first to ensure updates apply cleanly

-- Helper to drop policies if they exist
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
    execute 'drop policy if exists "Public Read Profiles" on profiles';
    execute 'drop policy if exists "Users can update own profile" on profiles';
    
    -- Orders
    execute 'drop policy if exists "Authenticated Users Read Own Orders" on orders';
    execute 'drop policy if exists "Public Create Orders" on orders';
    execute 'drop policy if exists "Admin Manage Orders" on orders';
    
    -- Messages
    execute 'drop policy if exists "Public Create Messages" on messages';
    execute 'drop policy if exists "Admin Manage Messages" on messages';
end $$;

-- Enable RLS
alter table products enable row level security;
alter table blogs enable row level security;
alter table testimonials enable row level security;
alter table content enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;
alter table messages enable row level security;

-- Create Policies

-- Products: Everyone can read, only Admins can write
create policy "Public Read Products" on products for select using (true);
create policy "Admin Write Products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Blogs: Everyone can read, only Admins can write
create policy "Public Read Blogs" on blogs for select using (true);
create policy "Admin Write Blogs" on blogs for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Testimonials: Everyone can read, only Admins can write
create policy "Public Read Testimonials" on testimonials for select using (true);
create policy "Admin Write Testimonials" on testimonials for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Content: Everyone can read, only Admins can write
create policy "Public Read Content" on content for select using (true);
create policy "Admin Write Content" on content for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Profiles: 
-- 1. Users can read their own profile. Admins can read all.
create policy "Read Profiles" on profiles for select using (
  auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
-- 2. Users can update their own profile. Admins can update all.
create policy "Update Profiles" on profiles for update using (
  auth.uid() = id or exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
-- 3. Trigger automatically inserts, so we allow insert for service role or self (handled by trigger mostly)
create policy "Insert Profiles" on profiles for insert with check (auth.uid() = id);

-- Orders:
-- 1. Anyone can create an order (Guest checkout logic usually requires public insert or anon key)
create policy "Public Create Orders" on orders for insert with check (true);
-- 2. Admins can read all. Users can read own (based on email match).
create policy "Read Orders" on orders for select using (
  (auth.jwt() ->> 'email') = email OR exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
-- 3. Only Admins can update/delete
create policy "Admin Manage Orders" on orders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Messages:
-- 1. Public create
create policy "Public Create Messages" on messages for insert with check (true);
-- 2. Admin read/delete
create policy "Admin Manage Messages" on messages for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin Delete Messages" on messages for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admin Update Messages" on messages for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);


-- 4. STORAGE BUCKETS
-- Insert standard buckets if they don't exist
insert into storage.buckets (id, name, public) 
values 
  ('products', 'products', true),
  ('content', 'content', true),
  ('blogs', 'blogs', true),
  ('categories', 'categories', true),
  ('team', 'team', true)
on conflict (id) do nothing;

-- Storage Policies (Simplified: Public Read, Admin Write)
-- Note: 'storage.objects' policies are needed.
do $$ 
begin
    execute 'drop policy if exists "Public Read Images" on storage.objects';
    execute 'drop policy if exists "Admin Write Images" on storage.objects';
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


-- 5. TRIGGERS (Auto-create Profile)
-- This function runs when a new user signs up via Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 6. ADMIN BOOTSTRAP (FIX FOR EXISTING USER)
-- Manually insert the specific user as Admin if they exist in Auth but not in Profiles
-- Or update their role if they already exist in Profiles
insert into public.profiles (id, email, role, name)
values 
  ('0fe96ac1-e8ea-4db5-b6c4-dd62c8a4f09c', 'salmangbob@gmail.com', 'admin', 'Super Admin')
on conflict (id) do update 
set role = 'admin';
