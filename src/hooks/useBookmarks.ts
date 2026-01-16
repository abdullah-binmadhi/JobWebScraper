import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { BookmarkedJob, JobListing } from '@/types'

export function useBookmarks(userId?: string) {
    const queryClient = useQueryClient()

    // Fetch all bookmarked jobs for the user
    const {
        data: bookmarks = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['bookmarks', userId],
        queryFn: async () => {
            if (!userId) return []

            const { data, error } = await supabase
                .from('bookmarked_jobs')
                .select(`
          *,
          job_listing:job_listings(*)
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as unknown as (BookmarkedJob & { job_listing: JobListing })[]
        },
        enabled: !!userId,
    })

    // Get set of bookmarked job IDs for easy lookup
    const bookmarkedIds = new Set(bookmarks.map((b) => b.job_listing_id))

    // Add bookmark mutation
    const addBookmark = useMutation({
        mutationFn: async (jobId: string) => {
            if (!userId) throw new Error('User not authenticated')

            const { data, error } = await supabase
                .from('bookmarked_jobs')
                .insert({
                    user_id: userId,
                    job_listing_id: jobId,
                    status: 'saved',
                } as never)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] })
        },
    })

    // Remove bookmark mutation
    const removeBookmark = useMutation({
        mutationFn: async (jobId: string) => {
            if (!userId) throw new Error('User not authenticated')

            const { error } = await supabase
                .from('bookmarked_jobs')
                .delete()
                .eq('user_id', userId)
                .eq('job_listing_id', jobId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] })
        },
    })

    // Toggle bookmark
    const toggleBookmark = (jobId: string) => {
        if (bookmarkedIds.has(jobId)) {
            removeBookmark.mutate(jobId)
        } else {
            addBookmark.mutate(jobId)
        }
    }

    // Update bookmark status (or add if not exists)
    const updateStatus = useMutation({
        mutationFn: async ({ jobId, status }: { jobId: string; status: string }) => {
            if (!userId) throw new Error('User not authenticated')

            // Check if exists
            const { data: existing } = await supabase
                .from('bookmarked_jobs')
                .select('id')
                .eq('user_id', userId)
                .eq('job_listing_id', jobId)
                .single()

            let result
            if (existing) {
                const { data, error } = await supabase
                    .from('bookmarked_jobs')
                    .update({ status } as never)
                    .eq('id', existing.id)
                    .select()
                    .single()
                if (error) throw error
                result = data
            } else {
                const { data, error } = await supabase
                    .from('bookmarked_jobs')
                    .insert({
                        user_id: userId,
                        job_listing_id: jobId,
                        status: status,
                    } as never)
                    .select()
                    .single()
                if (error) throw error
                result = data
            }
            return result
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] })
        },
    })

    return {
        bookmarks,
        bookmarkedIds,
        isLoading,
        error: error instanceof Error ? error.message : null,
        toggleBookmark,
        markAsApplied: (jobId: string) => updateStatus.mutate({ jobId, status: 'applied' }),
        updateStatus: updateStatus.mutate,
        isToggling: addBookmark.isPending || removeBookmark.isPending || updateStatus.isPending,
    }
}
