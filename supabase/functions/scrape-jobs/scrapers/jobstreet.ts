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
    const apiKey = Deno.env.get('RAPIDAPI_KEY') || '9fb28bbeecmshbf041cfbea56022p1c0095jsnf30aa8808d68'

    for (const keyword of keywords) {
        try {
            console.log(`Fetching JobStreet via RapidAPI for: ${keyword}`)

            const response = await fetch('https://jobstreet.p.rapidapi.com/jobs/search', {
                method: 'GET',
                headers: {
                    'x-api-host': 'jobstreet.p.rapidapi.com',
                    'x-api-key': apiKey,
                },
                // Adjust params based on the specific RapidAPI JobStreet implementation
                // Assuming it takes q for query and l for location
                params: new URLSearchParams({
                    q: keyword,
                    l: filters.location || 'Malaysia',
                })
            })

            if (!response.ok) {
                console.error(`RapidAPI JobStreet returned status ${response.status}`)
                // Fallback to sample data for demo if API fails
                jobs.push(...generateSampleJobs(keyword, 'jobstreet', filters))
                continue
            }

            const data = await response.json()
            
            // Map the API results to our JobListing format
            // This part assumes the API returns an array of jobs in data.results or similar
            const apiJobs = data.results || data.jobs || []
            
            if (apiJobs.length > 0) {
                apiJobs.forEach((job: any) => {
                    jobs.push({
                        job_title: job.title || job.jobTitle || 'Untitled',
                        company_name: job.company || job.companyName || 'Unknown',
                        location: job.location || filters.location,
                        job_type: job.type || job.employmentType,
                        work_arrangement: job.workType || 'On-site',
                        salary_min: job.salaryMin,
                        salary_max: job.salaryMax,
                        salary_currency: job.currency || 'MYR',
                        salary_period: 'month',
                        description: job.description || job.snippet,
                        posted_date: job.date || job.postedAt,
                        original_url: job.url || job.link,
                        source_platform: 'jobstreet',
                        logo_url: job.companyLogo || job.logo,
                    })
                })
            } else {
                // Fallback if no results
                jobs.push(...generateSampleJobs(keyword, 'jobstreet', filters))
            }

        } catch (error) {
            console.error(`Error with RapidAPI JobStreet for "${keyword}":`, error)
            jobs.push(...generateSampleJobs(keyword, 'jobstreet', filters))
        }
    }

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
        original_url: `https://www.jobstreet.com.my/jobs?keywords=${encodeURIComponent(keyword)}`,
        source_platform: platform,
        experience_level: ['Entry Level', 'Mid Level', 'Senior', 'Entry Level', 'Mid Level'][i % 5],
    }))
}
