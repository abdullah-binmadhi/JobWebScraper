export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            job_listings: {
                Row: {
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
                Insert: {
                    id?: string
                    job_title: string
                    company_name: string
                    location?: string | null
                    job_type?: string | null
                    work_arrangement?: string | null
                    salary_min?: number | null
                    salary_max?: number | null
                    salary_currency?: string | null
                    salary_period?: string | null
                    description?: string | null
                    requirements?: string | null
                    benefits?: string | null
                    posted_date?: string | null
                    deadline_date?: string | null
                    original_url: string
                    source_platform: string
                    experience_level?: string | null
                    industry?: string | null
                    company_size?: string | null
                    logo_url?: string | null
                    scraped_at?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    job_title?: string
                    company_name?: string
                    location?: string | null
                    job_type?: string | null
                    work_arrangement?: string | null
                    salary_min?: number | null
                    salary_max?: number | null
                    salary_currency?: string | null
                    salary_period?: string | null
                    description?: string | null
                    requirements?: string | null
                    benefits?: string | null
                    posted_date?: string | null
                    deadline_date?: string | null
                    original_url?: string
                    source_platform?: string
                    experience_level?: string | null
                    industry?: string | null
                    company_size?: string | null
                    logo_url?: string | null
                    scraped_at?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            saved_searches: {
                Row: {
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
                Insert: {
                    id?: string
                    user_id: string
                    search_name: string
                    keywords: string[]
                    job_type_filters?: string[] | null
                    platforms: string[]
                    location_filter?: string | null
                    salary_min?: number | null
                    experience_level_filters?: string[] | null
                    created_at?: string
                    last_run?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string
                    search_name?: string
                    keywords?: string[]
                    job_type_filters?: string[] | null
                    platforms?: string[]
                    location_filter?: string | null
                    salary_min?: number | null
                    experience_level_filters?: string[] | null
                    created_at?: string
                    last_run?: string | null
                    is_active?: boolean
                }
            }
            bookmarked_jobs: {
                Row: {
                    id: string
                    user_id: string
                    job_listing_id: string
                    notes: string | null
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    job_listing_id: string
                    notes?: string | null
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    job_listing_id?: string
                    notes?: string | null
                    status?: string
                    created_at?: string
                }
            }
            scrape_logs: {
                Row: {
                    id: string
                    user_id: string | null
                    search_query: Json
                    platforms_scraped: string[]
                    total_results: number | null
                    status: string
                    error_message: string | null
                    execution_time_ms: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    search_query: Json
                    platforms_scraped: string[]
                    total_results?: number | null
                    status: string
                    error_message?: string | null
                    execution_time_ms?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    search_query?: Json
                    platforms_scraped?: string[]
                    total_results?: number | null
                    status?: string
                    error_message?: string | null
                    execution_time_ms?: number | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
