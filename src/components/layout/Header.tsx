import { Link, useLocation } from 'react-router-dom'
import { Search, Bookmark, LayoutDashboard, Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isDark, setIsDark] = useState(true)
    const location = useLocation()

    useEffect(() => {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light') {
            setIsDark(false)
            document.documentElement.classList.add('light')
        }
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
        if (isDark) {
            document.documentElement.classList.add('light')
            localStorage.setItem('theme', 'light')
        } else {
            document.documentElement.classList.remove('light')
            localStorage.setItem('theme', 'dark')
        }
    }

    const navItems = [
        { href: '/', label: 'Search', icon: Search },
        { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-7xl items-center justify-between px-4 mx-auto">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                        <Search className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">JobHunter</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={isActive(item.href) ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'flex items-center gap-2',
                                        isActive(item.href) && 'bg-secondary'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border animate-slide-in">
                    <nav className="container px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Button
                                        variant={isActive(item.href) ? 'secondary' : 'ghost'}
                                        className="w-full justify-start gap-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            )}
        </header>
    )
}
