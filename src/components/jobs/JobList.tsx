import { JobCard } from './JobCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertCircle, SearchX, RefreshCw } from 'lucide-react'
import type { JobListing } from '@/types'

interface JobListProps {
    jobs: JobListing[]
    isLoading: boolean
    error?: string | null
    bookmarkedIds?: Set<string>
    onBookmark?: (jobId: string) => void
    onJobClick?: (job: JobListing) => void
    onRetry?: () => void
}

export function JobList({
    jobs,
    isLoading,
    error,
    bookmarkedIds = new Set(),
    onBookmark,
    onJobClick,
    onRetry,
}: JobListProps) {
    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Search Failed</h3>
                <p className="text-muted-foreground text-sm max-w-md mb-6">{error}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                )}
            </div>
        )
    }

    // Empty State
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Jobs Found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                    Try adjusting your search keywords or filters to find more results.
                </p>
            </div>
        )
    }

    // Results
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{jobs.length}</span> job
                    {jobs.length !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="space-y-3">
                {jobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        isBookmarked={bookmarkedIds.has(job.id)}
                        onBookmark={onBookmark}
                        onClick={() => onJobClick?.(job)}
                    />
                ))}
            </div>
        </div>
    )
}

function JobCardSkeleton() {
    return (
        <div className="p-5 rounded-lg border border-border bg-card">
            <div className="flex gap-4">
                <Skeleton className="w-14 h-14 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex justify-between pt-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
