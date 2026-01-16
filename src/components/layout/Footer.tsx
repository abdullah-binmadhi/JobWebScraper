import { Heart } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Built with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>using React + Supabase</span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            GitHub
                        </a>
                        <span>•</span>
                        <span>© {new Date().getFullYear()} JobHunter</span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs text-center text-muted-foreground">
                        Job listings are aggregated from JobStreet, LinkedIn, Indeed, and Hiredly.
                        All job postings link to their original sources.
                    </p>
                </div>
            </div>
        </footer>
    )
}
