import { cn } from '@/lib/utils'
import { PLATFORMS } from '@/lib/constants'
import { Check } from 'lucide-react'

interface PlatformSelectorProps {
    selectedPlatforms: string[]
    onPlatformToggle: (platform: string) => void
    disabled?: boolean
}

export function PlatformSelector({
    selectedPlatforms,
    onPlatformToggle,
    disabled = false,
}: PlatformSelectorProps) {
    const platformStyles: Record<string, { bg: string; border: string; text: string }> = {
        jobstreet: {
            bg: 'bg-blue-500/10 hover:bg-blue-500/20',
            border: 'border-blue-500/50',
            text: 'text-blue-400',
        },
        linkedin: {
            bg: 'bg-sky-500/10 hover:bg-sky-500/20',
            border: 'border-sky-500/50',
            text: 'text-sky-400',
        },
        indeed: {
            bg: 'bg-indigo-500/10 hover:bg-indigo-500/20',
            border: 'border-indigo-500/50',
            text: 'text-indigo-400',
        },
        hiredly: {
            bg: 'bg-purple-500/10 hover:bg-purple-500/20',
            border: 'border-purple-500/50',
            text: 'text-purple-400',
        },
    }

    const toggleAll = () => {
        if (selectedPlatforms.length === PLATFORMS.length) {
            // Deselect all, but keep at least one
            onPlatformToggle(PLATFORMS[0].id)
        } else {
            // Select all platforms
            PLATFORMS.forEach((p) => {
                if (!selectedPlatforms.includes(p.id)) {
                    onPlatformToggle(p.id)
                }
            })
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Select Platforms</span>
                <button
                    onClick={toggleAll}
                    disabled={disabled}
                    className="text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                    {selectedPlatforms.length === PLATFORMS.length ? 'Deselect all' : 'Select all'}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PLATFORMS.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id)
                    const styles = platformStyles[platform.id]

                    return (
                        <button
                            key={platform.id}
                            onClick={() => onPlatformToggle(platform.id)}
                            disabled={disabled}
                            className={cn(
                                'relative flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                isSelected
                                    ? `${styles.bg} ${styles.border} ${styles.text}`
                                    : 'bg-muted/30 border-border hover:border-border/80 text-muted-foreground'
                            )}
                        >
                            {isSelected && (
                                <Check className="absolute top-1.5 right-1.5 h-3 w-3" />
                            )}
                            <span className="font-medium text-sm">{platform.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
