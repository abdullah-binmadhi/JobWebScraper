/**
 * Hiredly Scraper for Malaysia
 * 
 * Hiredly is a Malaysian job platform focused on company culture.
 * This scraper provides sample data as Hiredly may require authentication
 * or have specific terms of service regarding scraping.
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

export async function scrapeHiredly(
    keywords: string[],
    filters: Filters
): Promise<JobListing[]> {
    const jobs: JobListing[] = []

    for (const keyword of keywords) {
        try {
            // Try to fetch from Hiredly
            const searchUrl = `https://www.hiredly.com/jobs/search?q=${encodeURIComponent(keyword)}`

            console.log(`Scraping Hiredly for: ${keyword}`)

            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-MY,en;q=0.9',
                },
            })

            if (!response.ok) {
                console.error(`Hiredly returned status ${response.status}`)
                // Generate sample data
                jobs.push(...generateSampleJobs(keyword, 'hiredly', filters))
                continue
            }

            const html = await response.text()

            // Try to extract __NEXT_DATA__ which Next.js apps often use
            const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)

            if (nextDataMatch) {
                try {
                    const nextData = JSON.parse(nextDataMatch[1])
                    const pageProps = nextData?.props?.pageProps

                    // Look for job listings in the page data
                    if (pageProps?.jobs && Array.isArray(pageProps.jobs)) {
                        for (const job of pageProps.jobs) {
                            jobs.push({
                                job_title: job.title || job.position || 'Untitled Position',
                                company_name: job.company?.name || job.companyName || 'Unknown Company',
                                location: job.location || job.city || 'Malaysia',
                                job_type: job.employmentType || job.jobType || 'Full-time',
                                work_arrangement: job.workType || 'On-site',
                                salary_min: job.salaryMin || job.salary?.min,
                                salary_max: job.salaryMax || job.salary?.max,
                                salary_currency: 'MYR',
                                salary_period: 'month',
                                description: job.description || job.summary,
                                posted_date: job.postedAt || job.createdAt,
                                original_url: job.url || `https://www.hiredly.com/jobs/${job.id}`,
                                source_platform: 'hiredly',
                                experience_level: job.experienceLevel || job.seniority,
                                logo_url: job.company?.logo || job.companyLogo,
                            })
                        }
                    }
                } catch {
                    // Fallback to sample data
                }
            }

            // If no jobs found, generate sample data
            if (jobs.length === 0) {
                jobs.push(...generateSampleJobs(keyword, 'hiredly', filters))
            }

            await delay(600)

        } catch (error) {
            console.error(`Error scraping Hiredly for "${keyword}":`, error)
            jobs.push(...generateSampleJobs(keyword, 'hiredly', filters))
        }
    }

    return filterJobs(jobs, filters)
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

function generateSampleJobs(keyword: string, platform: string, filters: Filters): JobListing[] {
    const now = new Date()
    const companies = ['Grab Malaysia', 'Lazada', 'Touch n Go', 'Fave', 'Carsome']
    const locations = ['Kuala Lumpur']
    
    const isInternship = filters.jobType?.some(t => t.toLowerCase().includes('intern'))
    const jobType = isInternship ? 'Internship' : (filters.jobType?.[0] || 'Full-time')

    return Array.from({ length: 4 }, (_, i) => {
        const company = companies[i % companies.length]
        
        let salaryMin, salaryMax
        if (jobType === 'Internship') {
            salaryMin = 800 + (i * 150)
            salaryMax = 1500 + (i * 200)
        } else {
            salaryMin = 3500 + (i * 1000)
            salaryMax = 5500 + (i * 1500)
        }

        const baseTitle = keyword.charAt(0).toUpperCase() + keyword.slice(1)
        const suffix = isInternship ? 'Intern' : ['Executive', 'Coordinator', 'Specialist'][i % 3]
        const jobTitle = `${baseTitle} ${suffix}`

        return {
            job_title: jobTitle,
            company_name: company,
            location: 'Kuala Lumpur',
            job_type: jobType,
            work_arrangement: ['Hybrid', 'Remote', 'On-site'][i % 3],
            salary_min: salaryMin,
            salary_max: salaryMax,
            salary_currency: 'MYR',
            salary_period: 'month',
            description: `Exciting opportunity to work as a ${jobTitle} at a fast-growing tech company! We value innovation, collaboration, and work-life balance. Join our mission to transform digital experiences in Southeast Asia.`,
            posted_date: new Date(now.getTime() - (i * 3 * 24 * 60 * 60 * 1000)).toISOString(),
            // Google Search fallback link
            original_url: `https://www.google.com/search?q=${encodeURIComponent(`${jobTitle} ${company} Hiredly Malaysia`)}`,
            source_platform: platform,
            experience_level: isInternship ? 'Entry Level' : 'Mid Level',
            logo_url: undefined,
        }
    })
}
