-- Drop existing tables to ensure clean schema creation (since previous runs might have created lowercase columns)
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.content CASCADE;

-- Create custom types for roles and statuses
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'customer',
    wishlist TEXT[] DEFAULT '{}',
    cart JSONB DEFAULT '[]'::jsonb,
    phone TEXT,
    address TEXT,
    city TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    images TEXT[] NOT NULL,
    description TEXT NOT NULL,
    specs JSONB,
    features TEXT[],
    "inStock" BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    items JSONB NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table (for singleton site content)
CREATE TABLE IF NOT EXISTS public.content (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Update these for production)
-- Allow public read access to most things
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read content" ON public.content FOR SELECT USING (true);

-- Allow authenticated users to read and update their own profile
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
-- Need an insert policy for profile creation via triggers or direct upsert
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert orders, and read their own
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid()::text = "userId");

-- Allow anyone to insert messages
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Allow all actions for admin users across all main product/content tables
-- Using a subquery to check if the authenticated user has the 'admin' role in the users table.
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access blogs" ON public.blogs FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access content" ON public.content FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access messages" ON public.messages FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

-- Storage Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Access Blogs" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
CREATE POLICY "Public Access Testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');

CREATE POLICY "Upload Access Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Upload Access Blogs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blogs' AND auth.role() = 'authenticated');
CREATE POLICY "Upload Access Testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

-- Function and Trigger to auto-create user profile (Optional but good practice)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS trigger AS $$
-- BEGIN
--   INSERT INTO public.users (id, email, name, role)
--   VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'customer');
--   RETURN new;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
-- 
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Turn on realtime for specific tables
alter publication supabase_realtime add table products, blogs, testimonials, messages, orders, content;

-- ==============================================================================
-- 🛠️ ADMIN SETUP HELPER
-- ==============================================================================
-- To grant a user admin access to the Admin Portal, run this query in your
-- Supabase SQL Editor after they have created an account:
-- 
-- UPDATE public.users 
-- SET role = 'admin' 
-- WHERE email = 'YOUR_ADMIN_EMAIL@example.com';
-- ==============================================================================
