import { ResumeData } from '../schemas/resume'

export interface ATSInsights {
  score: number
  keywordMatches: number
  totalKeywords: number
  keywordsMissing: string[]
  suggestions: string[]
}

const KEYWORDS = [
  'resume',
  'portfolio',
  'ai',
  'design',
  'collaboration',
  'metrics',
  'growth',
  'leadership',
  'impact',
]

const normalize = (value: string): string => value.toLowerCase()

export const analyzeResume = (resume: ResumeData): ATSInsights => {
  const content = [
    resume.personal.headline,
    resume.summary,
    resume.skills.join(' '),
    resume.experience.map((item) => item.achievements.join(' ')).join(' '),
  ]
    .join(' ')
    .toLowerCase()

  const matched = KEYWORDS.filter((keyword) => content.includes(keyword))
  const missing = KEYWORDS.filter((keyword) => !matched.includes(keyword))

  const baseScore = (matched.length / KEYWORDS.length) * 70
  const experienceBonus = Math.min(resume.experience.length * 5, 15)
  const projectBonus = Math.min(resume.projects.length * 5, 15)

  const score = Math.min(Math.round(baseScore + experienceBonus + projectBonus), 100)

  const suggestions: string[] = []

  if (missing.length) {
    const highlighted = missing.slice(0, 3).map((item) => `“${item}”`).join(', ')
    suggestions.push(`Consider weaving in keywords like ${highlighted}.`)
  }

  if (resume.summary.length < 220) {
    suggestions.push('Expand the summary to include measurable outcomes and focus areas.')
  }

  if (!resume.projects.length) {
    suggestions.push('Add at least one project that showcases recent work or outcomes.')
  }

  const seenSkills = new Set(resume.skills.map((skill) => normalize(skill)))
  const uniqueSkillRatio = seenSkills.size / resume.skills.length

  if (uniqueSkillRatio < 0.8) {
    suggestions.push('Tighten the skills list to reduce overlap and highlight distinct strengths.')
  }

  return {
    score,
    keywordMatches: matched.length,
    totalKeywords: KEYWORDS.length,
    keywordsMissing: missing,
    suggestions,
  }
}


