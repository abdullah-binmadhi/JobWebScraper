export const PLATFORMS = [
    { id: 'jobstreet', name: 'JobStreet', color: 'jobstreet' },
    { id: 'linkedin', name: 'LinkedIn', color: 'linkedin' },
    { id: 'indeed', name: 'Indeed', color: 'indeed' },
    { id: 'hiredly', name: 'Hiredly', color: 'hiredly' },
] as const

export const JOB_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
] as const

export const EXPERIENCE_LEVELS = [
    'Entry Level',
    'Mid Level',
    'Senior',
    'Executive',
] as const

export const WORK_ARRANGEMENTS = [
    'Remote',
    'Hybrid',
    'On-site',
] as const

export const BOOKMARK_STATUSES = [
    'saved',
    'applied',
    'interviewing',
    'rejected',
    'accepted',
] as const

export type Platform = typeof PLATFORMS[number]['id']
export type JobType = typeof JOB_TYPES[number]
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]
export type WorkArrangement = typeof WORK_ARRANGEMENTS[number]
export type BookmarkStatus = typeof BOOKMARK_STATUSES[number]
