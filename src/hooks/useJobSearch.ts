import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { JobListing, SearchFilters, SearchResponse } from '@/types'

interface UseJobSearchReturn {
    search: (keywords: string[], platforms: string[], filters: SearchFilters) => void
    results: JobListing[]
    isLoading: boolean
    error: string | null
    reset: () => void
}

export function useJobSearch(): UseJobSearchReturn {
    const [results, setResults] = useState<JobListing[]>([])
    const [error, setError] = useState<string | null>(null)

    const mutation = useMutation({
        mutationFn: async ({
            keywords,
            platforms,
            filters,
        }: {
            keywords: string[]
            platforms: string[]
            filters: SearchFilters
        }) => {
            // Call the Supabase Edge Function
            const { data, error } = await supabase.functions.invoke<SearchResponse>('scrape-jobs', {
                body: { keywords, platforms, filters },
            })

            if (error) {
                throw new Error(error.message || 'Failed to search jobs')
            }

            if (!data?.success) {
                throw new Error(data?.errors?.join(', ') || 'Search failed')
            }

            return data
        },
        onSuccess: (data) => {
            setResults(data.jobs)
            setError(null)
        },
        onError: (err: Error) => {
            setError(err.message)
            setResults([])
        },
    })

    const search = (keywords: string[], platforms: string[], filters: SearchFilters) => {
        mutation.mutate({ keywords, platforms, filters })
    }

    const reset = () => {
        setResults([])
        setError(null)
        mutation.reset()
    }

    return {
        search,
        results,
        isLoading: mutation.isPending,
        error,
        reset,
    }
}
