import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X, Loader2, Plus } from 'lucide-react'

interface SearchBarProps {
    onSearch: (keywords: string[], platforms: string[]) => void
    isLoading: boolean
    selectedPlatforms: string[]
}

export function SearchBar({ onSearch, isLoading, selectedPlatforms }: SearchBarProps) {
    const [keyword, setKeyword] = useState('')
    const [keywords, setKeywords] = useState<string[]>([])

    const addKeyword = () => {
        const trimmed = keyword.trim()
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords([...keywords, trimmed])
            setKeyword('')
        }
    }

    const removeKeyword = (kw: string) => {
        setKeywords(keywords.filter((k) => k !== kw))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (keyword.trim()) {
                addKeyword()
            } else if (keywords.length > 0) {
                handleSearch()
            }
        }
    }

    const handleSearch = () => {
        if (keywords.length > 0 && selectedPlatforms.length > 0) {
            onSearch(keywords, selectedPlatforms)
        }
    }

    const clearAll = () => {
        setKeywords([])
        setKeyword('')
    }

    return (
        <div className="w-full space-y-4">
            {/* Search Input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Enter job keywords (e.g., Data Analyst, Marketing Intern)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-base"
                        disabled={isLoading}
                    />
                </div>
                <Button
                    onClick={addKeyword}
                    variant="outline"
                    size="lg"
                    disabled={!keyword.trim() || isLoading}
                    className="h-12"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                </Button>
            </div>

            {/* Keywords Tags */}
            {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                    {keywords.map((kw) => (
                        <Badge
                            key={kw}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm flex items-center gap-1.5 group hover:bg-secondary/80 transition-colors"
                        >
                            {kw}
                            <button
                                onClick={() => removeKeyword(kw)}
                                className="opacity-60 hover:opacity-100 transition-opacity"
                                disabled={isLoading}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    {keywords.length > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Clear all
                        </Button>
                    )}
                </div>
            )}

            {/* Search Button */}
            <Button
                onClick={handleSearch}
                disabled={keywords.length === 0 || selectedPlatforms.length === 0 || isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                size="lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Searching {selectedPlatforms.length} platforms...
                    </>
                ) : (
                    <>
                        <Search className="mr-2 h-5 w-5" />
                        Search {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                    </>
                )}
            </Button>

            {/* Hint */}
            <p className="text-xs text-center text-muted-foreground">
                Press Enter to add keywords, then click Search to find jobs across multiple platforms
            </p>
        </div>
    )
}
