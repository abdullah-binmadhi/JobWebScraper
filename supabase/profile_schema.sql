-- Create a bucket for Resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);

-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL, -- In a real app, references auth.users
    full_name TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    resume_url TEXT,
    skills TEXT[],
    experience_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public access for now (Guest Mode)
CREATE POLICY "Public read/write access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public storage access" ON storage.objects FOR ALL USING ( bucket_id = 'resumes' );
