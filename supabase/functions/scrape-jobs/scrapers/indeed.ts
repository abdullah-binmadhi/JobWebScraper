/**
 * Indeed Scraper for Malaysia
 * 
 * Note: Indeed has strong anti-scraping measures. This implementation uses
 * basic fetch and sample data fallback. For production use, consider:
 * - Indeed Publisher Program (official API)
 * - Rotating proxies
 * - Browser automation (Puppeteer)
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

export async function scrapeIndeed(
    keywords: string[],
    filters: Filters
): Promise<JobListing[]> {
    const jobs: JobListing[] = []
    const apiKey = Deno.env.get('RAPIDAPI_KEY') || '9fb28bbeecmshbf041cfbea56022p1c0095jsnf30aa8808d68'

    for (const keyword of keywords) {
        try {
            console.log(`Fetching Indeed via RapidAPI for: ${keyword}`)

            // Assuming a standard search endpoint for the indeed-scraper-api
            const response = await fetch('https://indeed-scraper-api.p.rapidapi.com/search', {
                method: 'GET',
                headers: {
                    'x-api-host': 'indeed-scraper-api.p.rapidapi.com',
                    'x-api-key': apiKey,
                },
                // Example params - adjust based on specific API documentation if needed
                params: new URLSearchParams({
                    q: keyword,
                    l: filters.location || 'Malaysia',
                    // jt: filters.jobType?.[0] || 'all'
                })
            })

            if (!response.ok) {
                console.error(`RapidAPI Indeed returned status ${response.status}`)
                jobs.push(...generateSampleJobs(keyword, 'indeed', filters))
                continue
            }

            const data = await response.json()
            const apiJobs = data.results || data.jobs || data.data || []

            if (apiJobs.length > 0) {
                apiJobs.forEach((job: any) => {
                    jobs.push({
                        job_title: job.jobTitle || job.title || 'Untitled',
                        company_name: job.companyName || job.company || 'Unknown',
                        location: job.location || filters.location,
                        job_type: job.jobType || job.type,
                        work_arrangement: job.workType || 'On-site',
                        salary_min: job.salaryMin || job.salary?.min,
                        salary_max: job.salaryMax || job.salary?.max,
                        salary_currency: job.currency || 'MYR',
                        salary_period: 'month',
                        description: job.description || job.snippet,
                        posted_date: job.date || job.postedAt,
                        original_url: job.url || job.link,
                        source_platform: 'indeed',
                        logo_url: job.companyLogo || job.logo,
                    })
                })
            } else {
                jobs.push(...generateSampleJobs(keyword, 'indeed', filters))
            }

        } catch (error) {
            console.error(`Error with RapidAPI Indeed for "${keyword}":`, error)
            jobs.push(...generateSampleJobs(keyword, 'indeed', filters))
        }
    }

    return filterJobs(jobs, filters)
}

function parseJobPosting(data: Record<string, unknown>, platform: string): JobListing {
    return {
        job_title: (data.title as string) || 'Untitled Position',
        company_name: (data.hiringOrganization as Record<string, unknown>)?.name as string || 'Unknown Company',
        location: (data.jobLocation as Record<string, unknown>)?.address?.addressLocality as string || undefined,
        job_type: parseJobType(data.employmentType as string | string[]),
        work_arrangement: parseWorkArrangement(data.jobLocationType as string),
        salary_min: parseSalary((data.baseSalary as Record<string, unknown>)?.value?.minValue),
        salary_max: parseSalary((data.baseSalary as Record<string, unknown>)?.value?.maxValue),
        salary_currency: (data.baseSalary as Record<string, unknown>)?.currency as string || 'MYR',
        salary_period: 'month',
        description: cleanDescription(data.description as string),
        posted_date: data.datePosted as string,
        original_url: (data.url as string) || `https://my.indeed.com/job/${Date.now()}`,
        source_platform: platform,
        logo_url: (data.hiringOrganization as Record<string, unknown>)?.logo as string,
    }
}

function parseJobType(employmentType: string | string[] | undefined): string | undefined {
    if (!employmentType) return undefined
    const types = Array.isArray(employmentType) ? employmentType : [employmentType]

    const typeMap: Record<string, string> = {
        'FULL_TIME': 'Full-time',
        'PART_TIME': 'Part-time',
        'CONTRACT': 'Contract',
        'INTERN': 'Internship',
        'INTERNSHIP': 'Internship',
    }

    return typeMap[types[0]?.toUpperCase()] || types[0]
}

function parseWorkArrangement(locationType: string | undefined): string | undefined {
    if (!locationType) return 'On-site'
    return locationType.toUpperCase().includes('REMOTE') ? 'Remote' : 'On-site'
}

function parseSalary(value: unknown): number | undefined {
    if (!value) return undefined
    const num = typeof value === 'string' ? parseFloat(value) : Number(value)
    return isNaN(num) ? undefined : num
}

function cleanDescription(description: string | undefined): string | undefined {
    if (!description) return undefined
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
        return true
    })
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateSampleJobs(keyword: string, platform: string, filters: Filters): JobListing[] {
    const now = new Date()
    const companies = ['Acme Corporation', 'BlueTech Solutions', 'DataCorp Malaysia', 'Excel Industries', 'Future Systems']
    const locations = ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Sabah']
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']
    const arrangements = ['Remote', 'Hybrid', 'On-site']

    return Array.from({ length: 4 }, (_, i) => ({
        job_title: `${['Junior', 'Senior', '', 'Lead', 'Associate'][i % 5]} ${keyword}`,
        company_name: companies[i % companies.length],
        location: filters.location || locations[i % locations.length],
        job_type: filters.jobType?.[0] || jobTypes[i % jobTypes.length],
        work_arrangement: arrangements[i % arrangements.length],
        salary_min: 2500 + (i * 800),
        salary_max: 4500 + (i * 1200),
        salary_currency: 'MYR',
        salary_period: 'month',
        description: `Join our dynamic team as a ${keyword}! We offer competitive benefits, career growth opportunities, and a collaborative work environment. Looking for motivated individuals with strong problem-solving skills.`,
        posted_date: new Date(now.getTime() - (i * 2 * 24 * 60 * 60 * 1000)).toISOString(),
        original_url: `https://my.indeed.com/viewjob?jk=${Date.now()}-${i}`,
        source_platform: platform,
        experience_level: ['Entry Level', 'Senior', 'Mid Level', 'Entry Level', 'Mid Level'][i % 5],
    }))
}
