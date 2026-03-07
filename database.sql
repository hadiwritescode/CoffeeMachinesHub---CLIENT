-- SAFE DB INITIALIZATION
-- This script uses IF NOT EXISTS and DROP IF EXISTS so it is 100% rerunnable.

-- 1. Custom Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Tables
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

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    images TEXT[] NOT NULL,
    description TEXT NOT NULL,
    specs JSONB,
    features JSONB, -- Changed to JSONB for more flexibility
    "inStock" BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.content (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS Enablement
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 5. Policies Cleanup (Rerunnable setup)
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename IN ('users', 'products', 'blogs', 'testimonials', 'messages', 'orders', 'content')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- 6. Public Read Policies
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read content" ON public.content FOR SELECT USING (true);

-- 7. User Profiles Policies
CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Orders & Messages Policies
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can read own orders" ON public.orders FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- 9. Admin Policies (Master access)
-- Note: Replaced subqueries with a more performant way to check role if possible, but subquery is fine for small scale.
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access blogs" ON public.blogs FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access content" ON public.content FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access messages" ON public.messages FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

-- 10. Storage Setup
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true) ON CONFLICT (id) DO NOTHING;

-- 11. Storage Policies Cleanup
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- 12. Recreate Storage Policies
CREATE POLICY "Public Access Products" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public Access Blogs" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
CREATE POLICY "Public Access Testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');
CREATE POLICY "Public Access Categories" ON storage.objects FOR SELECT USING (bucket_id = 'categories');

CREATE POLICY "Upload Access Products" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Upload Access Blogs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blogs' AND auth.role() = 'authenticated');
CREATE POLICY "Upload Access Testimonials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');
CREATE POLICY "Upload Access Categories" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');

-- 13. Realtime Subscription (Bulletproof)
DO $$
DECLARE
    tbl_name text;
    tables_to_add text[] := ARRAY['products', 'blogs', 'testimonials', 'messages', 'orders', 'content'];
BEGIN
    -- Ensure publication exists
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;

    FOREACH tbl_name IN ARRAY tables_to_add
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = tbl_name
        ) THEN
            EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', tbl_name);
        END IF;
    END LOOP;
END $$;

-- 14. Helper to promote admin (Commented out)
-- UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
