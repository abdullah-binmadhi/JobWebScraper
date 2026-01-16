// Job Listing type
export interface JobListing {
    id: string
    job_title: string
    company_name: string
    location: string | null
    job_type: string | null
    work_arrangement: string | null
    salary_min: number | null
    salary_max: number | null
    salary_currency: string | null
    salary_period: string | null
    description: string | null
    requirements: string | null
    benefits: string | null
    posted_date: string | null
    deadline_date: string | null
    original_url: string
    source_platform: string
    experience_level: string | null
    industry: string | null
    company_size: string | null
    logo_url: string | null
    scraped_at: string
    created_at: string
    updated_at: string
}

// Saved Search type
export interface SavedSearch {
    id: string
    user_id: string
    search_name: string
    keywords: string[]
    job_type_filters: string[] | null
    platforms: string[]
    location_filter: string | null
    salary_min: number | null
    experience_level_filters: string[] | null
    created_at: string
    last_run: string | null
    is_active: boolean
}

// Bookmarked Job type
export interface BookmarkedJob {
    id: string
    user_id: string
    job_listing_id: string
    notes: string | null
    status: 'saved' | 'applied' | 'interviewing' | 'rejected' | 'accepted'
    created_at: string
    job_listing?: JobListing
}

// Scrape Log type
export interface ScrapeLog {
    id: string
    user_id: string | null
    search_query: {
        keywords: string[]
        filters: SearchFilters
    }
    platforms_scraped: string[]
    total_results: number | null
    status: 'success' | 'partial' | 'failed'
    error_message: string | null
    execution_time_ms: number | null
    created_at: string
}

// Search Filters
export interface SearchFilters {
    jobType?: string[]
    location?: string
    experienceLevel?: string[]
    workArrangement?: string[]
    salaryMin?: number
    salaryMax?: number
}

// Search Request
export interface SearchRequest {
    keywords: string[]
    platforms: string[]
    filters: SearchFilters
    userId?: string
}

// Search Response
export interface SearchResponse {
    success: boolean
    jobCount: number
    jobs: JobListing[]
    errors: string[] | null
}

// User type (from Supabase Auth)
export interface User {
    id: string
    email?: string
    user_metadata?: {
        full_name?: string
        avatar_url?: string
    }
}
