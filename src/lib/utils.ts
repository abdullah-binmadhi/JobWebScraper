import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatSalary(
    min?: number | null,
    max?: number | null,
    currency: string = 'MYR',
    period: string = 'month'
): string {
    if (!min && !max) return 'Salary not disclosed'

    const formatNumber = (n: number) => n.toLocaleString()

    if (min && max) {
        return `${currency} ${formatNumber(min)} - ${formatNumber(max)} / ${period}`
    }
    if (min) {
        return `From ${currency} ${formatNumber(min)} / ${period}`
    }
    if (max) {
        return `Up to ${currency} ${formatNumber(max)} / ${period}`
    }
    return 'Salary not disclosed'
}

export function formatRelativeDate(date: Date | string): string {
    const now = new Date()
    const targetDate = new Date(date)
    const diffInMs = now.getTime() - targetDate.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

export function getPlatformColor(platform: string): string {
    const colors: Record<string, string> = {
        jobstreet: 'platform-jobstreet',
        linkedin: 'platform-linkedin',
        indeed: 'platform-indeed',
        hiredly: 'platform-hiredly',
    }
    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}
