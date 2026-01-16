import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    ExternalLink,
    MapPin,
    Briefcase,
    Building2,
    DollarSign,
    Calendar,
    Clock,
    Users,
    Bookmark,
} from 'lucide-react'
import { cn, formatSalary, formatRelativeDate, getPlatformColor } from '@/lib/utils'
import type { JobListing } from '@/types'

interface JobDetailProps {
    job: JobListing | null
    open: boolean
    onOpenChange: (open: boolean) => void
    isBookmarked?: boolean
    onBookmark?: (jobId: string) => void
}

export function JobDetail({
    job,
    open,
    onOpenChange,
    isBookmarked = false,
    onBookmark,
}: JobDetailProps) {
    if (!job) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] p-0">
                <ScrollArea className="max-h-[85vh]">
                    <div className="p-6">
                        <DialogHeader className="space-y-4">
                            <div className="flex items-start gap-4">
                                {/* Company Logo */}
                                <div className="flex-shrink-0">
                                    {job.logo_url ? (
                                        <img
                                            src={job.logo_url}
                                            alt={job.company_name}
                                            className="w-16 h-16 rounded-xl object-contain bg-muted p-1"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                            <Building2 className="h-7 w-7 text-primary" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <DialogTitle className="text-xl font-bold leading-tight">
                                        {job.job_title}
                                    </DialogTitle>
                                    <DialogDescription className="text-base mt-1">
                                        {job.company_name}
                                    </DialogDescription>
                                </div>

                                {onBookmark && (
                                    <Button
                                        variant={isBookmarked ? 'secondary' : 'outline'}
                                        size="sm"
                                        onClick={() => onBookmark(job.id)}
                                        className={cn(isBookmarked && 'text-yellow-500')}
                                    >
                                        <Bookmark className={cn('h-4 w-4 mr-1.5', isBookmarked && 'fill-current')} />
                                        {isBookmarked ? 'Saved' : 'Save'}
                                    </Button>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-2">
                                {job.location && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {job.location}
                                    </Badge>
                                )}
                                {job.job_type && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" />
                                        {job.job_type}
                                    </Badge>
                                )}
                                {job.work_arrangement && (
                                    <Badge variant="secondary">{job.work_arrangement}</Badge>
                                )}
                                {job.experience_level && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {job.experience_level}
                                    </Badge>
                                )}
                                <Badge className={cn('capitalize', getPlatformColor(job.source_platform))}>
                                    {job.source_platform}
                                </Badge>
                            </div>
                        </DialogHeader>

                        {/* Details Section */}
                        <div className="mt-6 space-y-6">
                            {/* Salary & Timeline */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(job.salary_min || job.salary_max) && (
                                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <div className="flex items-center gap-2 text-green-500 text-sm font-medium mb-1">
                                            <DollarSign className="h-4 w-4" />
                                            Salary
                                        </div>
                                        <p className="text-lg font-semibold text-foreground">
                                            {formatSalary(
                                                job.salary_min,
                                                job.salary_max,
                                                job.salary_currency || 'MYR',
                                                job.salary_period || 'month'
                                            )}
                                        </p>
                                    </div>
                                )}

                                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium mb-1">
                                        <Calendar className="h-4 w-4" />
                                        Posted
                                    </div>
                                    <p className="text-base font-medium text-foreground">
                                        {job.posted_date ? formatRelativeDate(job.posted_date) : 'Recently'}
                                    </p>
                                    {job.deadline_date && (
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Deadline: {new Date(job.deadline_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {job.description && (
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            )}

                            {/* Requirements */}
                            {job.requirements && (
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-2">Requirements</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {job.requirements}
                                    </p>
                                </div>
                            )}

                            {/* Benefits */}
                            {job.benefits && (
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-2">Benefits</h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                        {job.benefits}
                                    </p>
                                </div>
                            )}

                            {/* Company Info */}
                            {(job.industry || job.company_size) && (
                                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Company Info</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {job.industry && (
                                            <div>
                                                <span className="text-muted-foreground">Industry:</span>
                                                <span className="ml-2 text-foreground">{job.industry}</span>
                                            </div>
                                        )}
                                        {job.company_size && (
                                            <div>
                                                <span className="text-muted-foreground">Company Size:</span>
                                                <span className="ml-2 text-foreground">{job.company_size}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Apply Button */}
                            <div className="pt-4 border-t border-border">
                                <Button asChild className="w-full" size="lg">
                                    <a href={job.original_url} target="_blank" rel="noopener noreferrer">
                                        Apply on {job.source_platform}
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
