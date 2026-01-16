import { useState, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { JOB_TYPES, EXPERIENCE_LEVELS, WORK_ARRANGEMENTS } from '@/lib/constants'
import type { SearchFilters } from '@/types'
import { Filter, X, Check, MapPin } from 'lucide-react'

interface FilterPanelProps {
    filters: SearchFilters
    onFilterChange: (filters: SearchFilters) => void
    disabled?: boolean
}

export function FilterPanel({ filters, onFilterChange, disabled = false }: FilterPanelProps) {
    // Local state to hold changes before applying
    // Ensure Kuala Lumpur is always the default location
    const [localFilters, setLocalFilters] = useState<SearchFilters>({
        ...filters,
        location: 'Kuala Lumpur',
    })

    // Sync local state when prop changes (e.g., reset)
    useEffect(() => {
        setLocalFilters({ ...filters, location: 'Kuala Lumpur' })
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
        // Reset to default state, but keep Location as Kuala Lumpur
        const emptyFilters = { location: 'Kuala Lumpur' }
        setLocalFilters(emptyFilters)
        onFilterChange(emptyFilters)
    }

    const applyFilters = () => {
        // Ensure location is set before applying
        onFilterChange({ ...localFilters, location: 'Kuala Lumpur' })
    }

    const hasActiveFilters =
        (localFilters.jobType?.length ?? 0) > 0 ||
        (localFilters.experienceLevel?.length ?? 0) > 0 ||
        (localFilters.workArrangement?.length ?? 0) > 0 ||
        localFilters.salaryMin

    return (
        <div className="flex flex-col max-h-[calc(100vh-8rem)] bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-3 p-5 border-b border-border bg-card z-10">
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
                
                {/* Fixed Location Indicator */}
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border/50">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">Kuala Lumpur</span>
                    <Badge variant="secondary" className="ml-auto text-[10px] h-5">Fixed</Badge>
                </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
                <div className="space-y-6 p-5">
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
                </div>
            </ScrollArea>

            {/* Footer with Apply Button */}
            <div className="p-5 border-t border-border bg-card z-10">
                <Button onClick={applyFilters} className="w-full" disabled={disabled}>
                    {disabled ? (
                        <>Searching...</>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Apply Filters
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
