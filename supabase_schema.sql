
-- Enable UUID extension for unique IDs
create extension if not exists "uuid-ossp";

-- 1. PRODUCTS TABLE
create table products (
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

-- 2. BLOGS TABLE
create table blogs (
  id text primary key,
  title text,
  excerpt text,
  content text,
  date text,
  image text,
  author text,
  "sourceLink" text
);

-- 3. TESTIMONIALS TABLE
create table testimonials (
  id text primary key,
  name text,
  role text,
  text text,
  rating numeric
);

-- 4. MESSAGES TABLE
create table messages (
  id uuid default uuid_generate_v4() primary key,
  date text,
  name text,
  email text,
  message text,
  read boolean default false
);

-- 5. ORDERS TABLE
create table orders (
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

-- 6. PROFILES TABLE (Linked to Auth Users)
create table profiles (
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

-- 7. CONTENT TABLE (Key-Value store for Site Content)
create table content (
  key text primary key,
  data jsonb
);

-- Enable Row Level Security (RLS) - Basic Rules
-- You can refine these in the Supabase Dashboard
alter table products enable row level security;
create policy "Public Read Products" on products for select using (true);
create policy "Admin Write Products" on products for all using (true); -- Requires auth check logic or service role

alter table blogs enable row level security;
create policy "Public Read Blogs" on blogs for select using (true);

alter table testimonials enable row level security;
create policy "Public Read Testimonials" on testimonials for select using (true);

alter table content enable row level security;
create policy "Public Read Content" on content for select using (true);

alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Create Storage Buckets (Run this manually or via Dashboard if SQL fails)
-- buckets: products, content, blogs, team, categories
