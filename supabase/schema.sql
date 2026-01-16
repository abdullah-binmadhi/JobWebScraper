-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Job Listings Table
CREATE TABLE IF NOT EXISTS public.job_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    location TEXT,
    job_type TEXT,
    work_arrangement TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency TEXT,
    salary_period TEXT,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    posted_date TEXT, -- Storing as text for flexibility or convert to TIMESTAMPTZ
    deadline_date TEXT,
    original_url TEXT UNIQUE NOT NULL,
    source_platform TEXT NOT NULL,
    experience_level TEXT,
    industry TEXT,
    company_size TEXT,
    logo_url TEXT,
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Searches Table
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Assuming linking to auth.users, but foreign key depends on auth setup
    search_name TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    job_type_filters TEXT[],
    platforms TEXT[] NOT NULL,
    location_filter TEXT,
    salary_min NUMERIC,
    experience_level_filters TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_run TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bookmarked Jobs Table
CREATE TABLE IF NOT EXISTS public.bookmarked_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    job_listing_id UUID REFERENCES public.job_listings(id) ON DELETE CASCADE,
    notes TEXT,
    status TEXT DEFAULT 'saved',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_listing_id)
);

-- Scrape Logs Table
CREATE TABLE IF NOT EXISTS public.scrape_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    search_query JSONB,
    platforms_scraped TEXT[],
    total_results INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    execution_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Best Practice
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarked_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scrape_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Basic examples, adjust as needed)
-- Public read access for job listings
CREATE POLICY "Public read access" ON public.job_listings FOR SELECT USING (true);

-- Allow service role (and scraper) full access to job_listings
-- Implicitly allowed for service role, but good to be explicit if needed for authenticated users?
-- For now, open read is fine.

-- Saved searches: Users can only see their own
-- CREATE POLICY "Users can see their own saved searches" ON public.saved_searches FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert their own saved searches" ON public.saved_searches FOR INSERT WITH CHECK (auth.uid() = user_id);

-- For now, since auth might not be fully set up in the app logic for anonymous users, we'll keep it simple or commented out until Auth is confirmed.
-- Note: user_id in saved_searches implies Auth.

