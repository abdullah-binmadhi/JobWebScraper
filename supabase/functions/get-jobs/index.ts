import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        )

        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') ?? '1')
        const limit = parseInt(url.searchParams.get('limit') ?? '20')
        const offset = (page - 1) * limit
        
        // Filters
        const keywords = url.searchParams.get('keywords')
        const location = url.searchParams.get('location')
        const jobType = url.searchParams.get('job_type')

        let query = supabase
            .from('job_listings')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (keywords) {
            // Simple text search on title and description
            query = query.or(`job_title.ilike.%${keywords}%,description.ilike.%${keywords}%`)
        }

        if (location) {
            query = query.ilike('location', `%${location}%`)
        }

        if (jobType) {
            query = query.eq('job_type', jobType)
        }

        const { data: jobs, error, count } = await query

        if (error) throw error

        return new Response(
            JSON.stringify({
                data: jobs,
                meta: {
                    page,
                    limit,
                    total: count,
                    totalPages: count ? Math.ceil(count / limit) : 0
                }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
