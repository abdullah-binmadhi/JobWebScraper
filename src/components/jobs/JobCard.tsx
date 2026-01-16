import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Bookmark,
    ExternalLink,
    MapPin,
    Calendar,
    Briefcase,
    Building2,
    DollarSign,
} from 'lucide-react'
import { cn, formatSalary, formatRelativeDate, getPlatformColor } from '@/lib/utils'
import type { JobListing } from '@/types'

interface JobCardProps {
    job: JobListing
    onBookmark?: (jobId: string) => void
    isBookmarked?: boolean
    onClick?: () => void
}

export function JobCard({ job, onBookmark, isBookmarked = false, onClick }: JobCardProps) {
    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onBookmark?.(job.id)
    }

    return (
        <Card
            className={cn(
                'p-5 transition-all duration-200 cursor-pointer card-hover',
                'border border-border hover:border-primary/30',
                'bg-card'
            )}
            onClick={onClick}
        >
            <div className="flex gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                    {job.logo_url ? (
                        <img
                            src={job.logo_url}
                            alt={job.company_name}
                            className="w-14 h-14 rounded-lg object-contain bg-muted p-1"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.nextElementSibling?.classList.remove('hidden')
                            }}
                        />
                    ) : null}
                    <div
                        className={cn(
                            'w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center',
                            job.logo_url && 'hidden'
                        )}
                    >
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                {job.job_title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{job.company_name}</p>
                        </div>
                        {onBookmark && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBookmarkClick}
                                className={cn(
                                    'h-9 w-9 flex-shrink-0',
                                    isBookmarked && 'text-yellow-500 hover:text-yellow-600'
                                )}
                            >
                                <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
                            </Button>
                        )}
                    </div>

                    {/* Meta Info Badges */}
                    <div className="flex flex-wrap gap-2">
                        {job.location && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                            </Badge>
                        )}
                        {job.job_type && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                <Briefcase className="h-3 w-3" />
                                {job.job_type}
                            </Badge>
                        )}
                        {job.work_arrangement && (
                            <Badge variant="secondary" className="text-xs">
                                {job.work_arrangement}
                            </Badge>
                        )}
                        <Badge className={cn('text-xs capitalize', getPlatformColor(job.source_platform))}>
                            {job.source_platform}
                        </Badge>
                    </div>

                    {/* Salary */}
                    {(job.salary_min || job.salary_max) && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            {formatSalary(
                                job.salary_min,
                                job.salary_max,
                                job.salary_currency || 'MYR',
                                job.salary_period || 'month'
                            )}
                        </div>
                    )}

                    {/* Description Preview */}
                    {job.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {job.posted_date ? formatRelativeDate(job.posted_date) : 'Recently posted'}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="h-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <a href={job.original_url} target="_blank" rel="noopener noreferrer">
                                View Job
                                <ExternalLink className="ml-1.5 h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
