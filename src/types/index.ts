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

export interface BookmarkedJob {
    id: string
    user_id: string
    job_listing_id: string
    notes?: string
    status: 'saved' | 'applied' | 'interviewing' | 'rejected' | 'offered'
    created_at: string
}

export interface UserProfile {
    id: string
    user_id: string
    full_name: string
    email: string
    phone?: string
    linkedin_url?: string
    portfolio_url?: string
    resume_url?: string
    skills?: string[]
    experience_summary?: string
}

export interface SearchFilters {
    jobType?: string[]
    location?: string // Enforced to 'Kuala Lumpur'
    experienceLevel?: string[]
    workArrangement?: string[]
    salaryMin?: number
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
