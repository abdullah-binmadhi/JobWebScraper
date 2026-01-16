import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Bookmark, Clock, TrendingUp } from 'lucide-react'

export function DashboardPage() {
    // TODO: Implement with auth
    const isAuthenticated = false

    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <Card className="max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Your Job Search Dashboard
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Sign in to access your personalized dashboard with saved searches, bookmarks, and search history.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Authentication coming soon...
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Track your job search progress
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard
                    title="Total Searches"
                    value="0"
                    icon={Search}
                    description="Searches performed"
                />
                <StatsCard
                    title="Saved Jobs"
                    value="0"
                    icon={Bookmark}
                    description="Jobs bookmarked"
                />
                <StatsCard
                    title="Applied"
                    value="0"
                    icon={TrendingUp}
                    description="Applications sent"
                />
                <StatsCard
                    title="This Week"
                    value="0"
                    icon={Clock}
                    description="Jobs viewed"
                />
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm text-center py-8">
                        Your recent search activity will appear here.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

function StatsCard({
    title,
    value,
    icon: Icon,
    description,
}: {
    title: string
    value: string
    icon: React.ComponentType<{ className?: string }>
    description: string
}) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
