import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { JOB_TYPES, EXPERIENCE_LEVELS, WORK_ARRANGEMENTS } from '@/lib/constants'
import type { SearchFilters } from '@/types'
import { Filter, X, Check } from 'lucide-react'

interface FilterPanelProps {
    filters: SearchFilters
    onFilterChange: (filters: SearchFilters) => void
    disabled?: boolean
}

export function FilterPanel({ filters, onFilterChange, disabled = false }: FilterPanelProps) {
    // Local state to hold changes before applying
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

    // Sync local state when prop changes (e.g., reset)
    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const updateArrayFilter = (
        key: 'jobType' | 'experienceLevel' | 'workArrangement',
        value: string,
        checked: boolean
    ) => {
        const currentArray = localFilters[key] || []
        const newArray = checked
            ? [...currentArray, value]
            : currentArray.filter((v) => v !== value)
        setLocalFilters({ ...localFilters, [key]: newArray.length > 0 ? newArray : undefined })
    }

    const clearFilters = () => {
        const emptyFilters = {}
        setLocalFilters(emptyFilters)
        onFilterChange(emptyFilters)
    }

    const applyFilters = () => {
        onFilterChange(localFilters)
    }

    const hasActiveFilters =
        (localFilters.jobType?.length ?? 0) > 0 ||
        (localFilters.experienceLevel?.length ?? 0) > 0 ||
        (localFilters.workArrangement?.length ?? 0) > 0 ||
        localFilters.location ||
        localFilters.salaryMin

    return (
        <div className="space-y-6 p-5 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-base font-semibold">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        disabled={disabled}
                        className="text-muted-foreground hover:text-foreground h-8"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                    </Button>
                )}
            </div>

            {/* Location */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Input
                    placeholder="e.g., Kuala Lumpur"
                    value={localFilters.location || ''}
                    onChange={(e) =>
                        setLocalFilters({ ...localFilters, location: e.target.value || undefined })
                    }
                    disabled={disabled}
                    className="h-9"
                />
            </div>

            {/* Job Type */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Job Type</Label>
                <div className="space-y-2">
                    {JOB_TYPES.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={`job-type-${type}`}
                                checked={localFilters.jobType?.includes(type) ?? false}
                                onCheckedChange={(checked) =>
                                    updateArrayFilter('jobType', type, !!checked)
                                }
                                disabled={disabled}
                            />
                            <Label
                                htmlFor={`job-type-${type}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {type}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Experience Level</Label>
                <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                                id={`exp-level-${level}`}
                                checked={localFilters.experienceLevel?.includes(level) ?? false}
                                onCheckedChange={(checked) =>
                                    updateArrayFilter('experienceLevel', level, !!checked)
                                }
                                disabled={disabled}
                            />
                            <Label
                                htmlFor={`exp-level-${level}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {level}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Work Arrangement */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Work Arrangement</Label>
                <div className="space-y-2">
                    {WORK_ARRANGEMENTS.map((arrangement) => (
                        <div key={arrangement} className="flex items-center space-x-2">
                            <Checkbox
                                id={`work-arr-${arrangement}`}
                                checked={localFilters.workArrangement?.includes(arrangement) ?? false}
                                onCheckedChange={(checked) =>
                                    updateArrayFilter('workArrangement', arrangement, !!checked)
                                }
                                disabled={disabled}
                            />
                            <Label
                                htmlFor={`work-arr-${arrangement}`}
                                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {arrangement}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Minimum Salary */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Minimum Salary (MYR/month)</Label>
                <Input
                    type="number"
                    placeholder="e.g., 3000"
                    value={localFilters.salaryMin || ''}
                    onChange={(e) =>
                        setLocalFilters({
                            ...localFilters,
                            salaryMin: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                    }
                    disabled={disabled}
                    className="h-9"
                />
            </div>

            <Button onClick={applyFilters} className="w-full" disabled={disabled}>
                <Check className="mr-2 h-4 w-4" />
                Apply Filters
            </Button>
        </div>
    )
}
