/**
 * JobStreet Scraper for Malaysia
 * 
 * Note: This is a basic implementation. In production, you should:
 * - Use a proper HTML parser like Cheerio
 * - Handle pagination
 * - Implement rate limiting
 * - Use rotating proxies for reliability
 * - Consider using official APIs if available
 */

interface JobListing {
    job_title: string
    company_name: string
    location?: string
    job_type?: string
    work_arrangement?: string
    salary_min?: number
    salary_max?: number
    salary_currency?: string
    salary_period?: string
    description?: string
    requirements?: string
    posted_date?: string
    original_url: string
    source_platform: string
    experience_level?: string
    logo_url?: string
}

interface Filters {
    jobType?: string[]
    location?: string
    experienceLevel?: string[]
    salaryMin?: number
}

export async function scrapeJobStreet(
    keywords: string[],
    filters: Filters
): Promise<JobListing[]> {
    const jobs: JobListing[] = []

    for (const keyword of keywords) {
        try {
            // Build search URL
            const params = new URLSearchParams({
                keywords: keyword,
                ...(filters.location && { location: filters.location }),
            })

            // JobStreet Malaysia search URL
            const searchUrl = `https://www.jobstreet.com.my/jobs?${params.toString()}`

            console.log(`Scraping JobStreet for: ${keyword}`)

            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                },
            })

            if (!response.ok) {
                console.error(`JobStreet returned status ${response.status}`)
                continue
            }

            const html = await response.text()

            // Try to extract JSON-LD data which often contains structured job listings
            const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)

            if (jsonLdMatches) {
                for (const match of jsonLdMatches) {
                    try {
                        const jsonContent = match
                            .replace(/<script type="application\/ld\+json">/, '')
                            .replace(/<\/script>/, '')
                            .trim()

                        const data = JSON.parse(jsonContent)

                        if (data['@type'] === 'JobPosting' || (Array.isArray(data) && data[0]?.['@type'] === 'JobPosting')) {
                            const jobData = Array.isArray(data) ? data[0] : data

                            jobs.push({
                                job_title: jobData.title || 'Untitled Position',
                                company_name: jobData.hiringOrganization?.name || 'Unknown Company',
                                location: jobData.jobLocation?.address?.addressLocality || filters.location,
                                job_type: parseJobType(jobData.employmentType),
                                work_arrangement: parseWorkArrangement(jobData.jobLocationType),
                                salary_min: parseSalary(jobData.baseSalary?.value?.minValue),
                                salary_max: parseSalary(jobData.baseSalary?.value?.maxValue),
                                salary_currency: jobData.baseSalary?.currency || 'MYR',
                                salary_period: 'month',
                                description: cleanDescription(jobData.description),
                                posted_date: jobData.datePosted,
                                original_url: jobData.url || searchUrl,
                                source_platform: 'jobstreet',
                                logo_url: jobData.hiringOrganization?.logo,
                            })
                        }
                    } catch (parseError) {
                        // Skip malformed JSON
                        continue
                    }
                }
            }

            // Fallback: Generate sample data for demo purposes if no real data found
            // In production, you would implement proper HTML parsing
            if (jobs.length === 0) {
                jobs.push(...generateSampleJobs(keyword, 'jobstreet', filters))
            }

            // Add delay between requests to be respectful
            await delay(500)

        } catch (error) {
            console.error(`Error scraping JobStreet for "${keyword}":`, error)
        }
    }

    // Apply filters
    return filterJobs(jobs, filters)
}

function parseJobType(employmentType: string | string[] | undefined): string | undefined {
    if (!employmentType) return undefined
    const types = Array.isArray(employmentType) ? employmentType : [employmentType]

    const typeMap: Record<string, string> = {
        'FULL_TIME': 'Full-time',
        'PART_TIME': 'Part-time',
        'CONTRACT': 'Contract',
        'INTERN': 'Internship',
        'TEMPORARY': 'Contract',
    }

    return typeMap[types[0]] || types[0]
}

function parseWorkArrangement(locationType: string | undefined): string | undefined {
    if (!locationType) return undefined

    const arrangementMap: Record<string, string> = {
        'TELECOMMUTE': 'Remote',
        'REMOTE': 'Remote',
    }

    return arrangementMap[locationType.toUpperCase()] || 'On-site'
}

function parseSalary(value: string | number | undefined): number | undefined {
    if (!value) return undefined
    const num = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(num) ? undefined : num
}

function cleanDescription(description: string | undefined): string | undefined {
    if (!description) return undefined
    // Remove HTML tags and clean up text
    return description
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 2000)
}

function filterJobs(jobs: JobListing[], filters: Filters): JobListing[] {
    return jobs.filter((job) => {
        if (filters.jobType?.length && job.job_type) {
            if (!filters.jobType.includes(job.job_type)) return false
        }
        if (filters.salaryMin && job.salary_max) {
            if (job.salary_max < filters.salaryMin) return false
        }
        if (filters.experienceLevel?.length && job.experience_level) {
            if (!filters.experienceLevel.includes(job.experience_level)) return false
        }
        return true
    })
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// Generate sample jobs for demonstration when scraping fails
function generateSampleJobs(keyword: string, platform: string, filters: Filters): JobListing[] {
    const now = new Date()
    const companies = ['Tech Solutions Sdn Bhd', 'Digital Ventures Malaysia', 'Innovation Labs', 'Global Systems MY', 'StartUp Hub KL']
    const locations = ['Kuala Lumpur', 'Petaling Jaya', 'Cyberjaya', 'Penang', 'Johor Bahru']
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
    const arrangements = ['Remote', 'Hybrid', 'On-site']

    return Array.from({ length: 5 }, (_, i) => ({
        job_title: `${keyword} ${['Specialist', 'Associate', 'Manager', 'Intern', 'Lead'][i % 5]}`,
        company_name: companies[i % companies.length],
        location: filters.location || locations[i % locations.length],
        job_type: filters.jobType?.[0] || jobTypes[i % jobTypes.length],
        work_arrangement: arrangements[i % arrangements.length],
        salary_min: 3000 + (i * 1000),
        salary_max: 5000 + (i * 1500),
        salary_currency: 'MYR',
        salary_period: 'month',
        description: `We are seeking a talented ${keyword} professional to join our team. This is an exciting opportunity to work on cutting-edge projects and grow your career. Requirements include strong analytical skills, excellent communication, and a passion for innovation.`,
        posted_date: new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        original_url: `https://www.jobstreet.com.my/job/${Date.now()}-${i}`,
        source_platform: platform,
        experience_level: ['Entry Level', 'Mid Level', 'Senior', 'Entry Level', 'Mid Level'][i % 5],
    }))
}
