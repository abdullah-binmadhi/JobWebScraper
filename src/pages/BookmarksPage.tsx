import { Bookmark, FolderOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function BookmarksPage() {
    // TODO: Implement with auth
    const isAuthenticated = false

    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Bookmark className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Save Jobs for Later
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Sign in to bookmark jobs and track your applications across all your devices.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Authentication coming soon...
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Saved Jobs</h1>
                    <p className="text-muted-foreground mt-1">
                        Your bookmarked job listings
                    </p>
                </div>
            </div>

            {/* Empty state placeholder */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Jobs</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                    Start searching and bookmark jobs you're interested in. They'll appear here.
                </p>
            </div>
        </div>
    )
}
