import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import scrapers
import { scrapeJobStreet } from './scrapers/jobstreet.ts'
import { scrapeIndeed } from './scrapers/indeed.ts'
import { scrapeHiredly } from './scrapers/hiredly.ts'
import { scrapeLinkedIn } from './scrapers/linkedin.ts'

interface ScrapeRequest {
    keywords: string[]
    platforms: string[]
    filters: {
        jobType?: string[]
        location?: string
        experienceLevel?: string[]
        salaryMin?: number
    }
    userId?: string
}

interface JobListing {
    job_title: string
    company_name: string
    location?: string
    job_type?: string
    work_arrangement?: string
    salary_min?: number
    salary_max?: number
    salary_currency?: string
    salary_period?: string
    description?: string
    requirements?: string
    benefits?: string
    posted_date?: string
    original_url: string
    source_platform: string
    experience_level?: string
    industry?: string
    company_size?: string
    logo_url?: string
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { keywords, platforms, filters, userId }: ScrapeRequest = await req.json()

        // Validate input
        if (!keywords || keywords.length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: 'Keywords are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        if (!platforms || platforms.length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: 'At least one platform is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const startTime = Date.now()

        // Scrape from all selected platforms in parallel
        const scrapePromises = platforms.map((platform) =>
            scrapePlatform(platform, keywords, filters)
        )

        const results = await Promise.allSettled(scrapePromises)

        // Aggregate results
        let allJobs: JobListing[] = []
        const errors: string[] = []

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                allJobs = [...allJobs, ...result.value]
            } else {
                errors.push(`${platforms[index]}: ${result.reason}`)
            }
        })

        // Store jobs in database (upsert to handle duplicates)
        if (allJobs.length > 0) {
            const { error: upsertError } = await supabaseClient
                .from('job_listings')
                .upsert(allJobs, {
                    onConflict: 'original_url',
                    ignoreDuplicates: false
                })

            if (upsertError) {
                console.error('Error upserting jobs:', upsertError)
            }
        }

        // Log the scrape operation
        await supabaseClient.from('scrape_logs').insert({
            user_id: userId || null,
            search_query: { keywords, filters },
            platforms_scraped: platforms,
            total_results: allJobs.length,
            status: errors.length === 0 ? 'success' : (allJobs.length > 0 ? 'partial' : 'failed'),
            error_message: errors.length > 0 ? errors.join('; ') : null,
            execution_time_ms: Date.now() - startTime,
        })

        return new Response(
            JSON.stringify({
                success: true,
                jobCount: allJobs.length,
                jobs: allJobs,
                errors: errors.length > 0 ? errors : null,
                executionTime: Date.now() - startTime,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Scrape error:', error)
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

async function scrapePlatform(
    platform: string,
    keywords: string[],
    filters: ScrapeRequest['filters']
): Promise<JobListing[]> {
    switch (platform.toLowerCase()) {
        case 'jobstreet':
            return await scrapeJobStreet(keywords, filters)
        case 'linkedin':
            return await scrapeLinkedIn(keywords, filters)
        case 'indeed':
            return await scrapeIndeed(keywords, filters)
        case 'hiredly':
            return await scrapeHiredly(keywords, filters)
        default:
            throw new Error(`Unknown platform: ${platform}`)
    }
}
