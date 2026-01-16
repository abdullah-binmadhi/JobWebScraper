import { useState } from 'react'
import { SearchBar } from '@/components/search/SearchBar'
import { PlatformSelector } from '@/components/search/PlatformSelector'
import { FilterPanel } from '@/components/search/FilterPanel'
import { JobList } from '@/components/jobs/JobList'
import { JobDetail } from '@/components/jobs/JobDetail'
import { useJobSearch } from '@/hooks/useJobSearch'
import { PLATFORMS } from '@/lib/constants'
import type { SearchFilters, JobListing } from '@/types'
import { Sparkles, Zap, Shield, Globe } from 'lucide-react'

export function HomePage() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
        PLATFORMS.map((p) => p.id)
    )
    const [filters, setFilters] = useState<SearchFilters>({})
    const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
    const [hasSearched, setHasSearched] = useState(false)

    const { search, results, isLoading, error } = useJobSearch()

    const handlePlatformToggle = (platform: string) => {
        setSelectedPlatforms((prev) => {
            if (prev.includes(platform)) {
                // Don't allow deselecting all platforms
                if (prev.length === 1) return prev
                return prev.filter((p) => p !== platform)
            }
            return [...prev, platform]
        })
    }

    const handleSearch = (keywords: string[], platforms: string[]) => {
        setHasSearched(true)
        search(keywords, platforms, filters)
    }

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            {!hasSearched && (
                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Find Your Dream Job
                            <span className="block mt-2 gradient-text">Across All Platforms</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Search once, discover opportunities from JobStreet, LinkedIn, Indeed, and Hiredly.
                            All in one place.
                        </p>
                    </div>
                </section>
            )}

            {/* Search Section */}
            <section className={hasSearched ? 'py-6' : 'pb-16'}>
                <div className="max-w-4xl mx-auto px-4 space-y-6">
                    <PlatformSelector
                        selectedPlatforms={selectedPlatforms}
                        onPlatformToggle={handlePlatformToggle}
                        disabled={isLoading}
                    />
                    <SearchBar
                        onSearch={handleSearch}
                        isLoading={isLoading}
                        selectedPlatforms={selectedPlatforms}
                    />
                </div>
            </section>

            {/* Results Section */}
            {hasSearched && (
                <section className="py-8 border-t border-border bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Filters Sidebar */}
                            <aside className="lg:col-span-1">
                                <div className="sticky top-20">
                                    <FilterPanel
                                        filters={filters}
                                        onFilterChange={setFilters}
                                        disabled={isLoading}
                                    />
                                </div>
                            </aside>

                            {/* Job Results */}
                            <main className="lg:col-span-3">
                                <JobList
                                    jobs={results}
                                    isLoading={isLoading}
                                    error={error}
                                    onJobClick={setSelectedJob}
                                    onRetry={() => handleSearch([], selectedPlatforms)}
                                />
                            </main>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section (only shown before search) */}
            {!hasSearched && (
                <section className="py-16 px-4 border-t border-border">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-12">
                            Why Use JobHunter?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FeatureCard
                                icon={Globe}
                                title="Multi-Platform"
                                description="Search across JobStreet, LinkedIn, Indeed, and Hiredly simultaneously"
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Real-Time Results"
                                description="Get fresh job listings scraped directly from source platforms"
                            />
                            <FeatureCard
                                icon={Sparkles}
                                title="Smart Filters"
                                description="Filter by job type, experience level, salary, and work arrangement"
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Save & Track"
                                description="Bookmark jobs and track your application status"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Job Detail Modal */}
            <JobDetail
                job={selectedJob}
                open={!!selectedJob}
                onOpenChange={(open) => !open && setSelectedJob(null)}
            />
        </div>
    )
}

function FeatureCard({
    icon: Icon,
    title,
    description,
}: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
}) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    )
}
