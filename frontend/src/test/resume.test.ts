import { describe, it, expect } from 'vitest'
import { resumeSchema, type Resume } from '../schemas/resume'

describe('Resume Schema', () => {
  describe('Valid Resume Parsing', () => {
    it('should parse a valid minimal resume', () => {
      const validResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        achievements: [],
        extras: {
          languages: [],
          certifications: [],
          interests: [],
        },
      }

      const result = resumeSchema.parse(validResume)
      expect(result.personal.firstName).toBe('John')
      expect(result.personal.lastName).toBe('Doe')
      expect(result.personal.email).toBe('john.doe@example.com')
    })

    it('should parse a complete resume with all fields', () => {
      const completeResume = {
        personal: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          location: 'New York, NY',
          website: 'https://janesmith.dev',
          linkedin: 'https://linkedin.com/in/janesmith',
          github: 'https://github.com/janesmith',
        },
        summary: 'Experienced software engineer with 5+ years of expertise.',
        experience: [
          {
            id: 'exp-1',
            company: 'Tech Corp',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2021-01',
            endDate: '',
            current: true,
            description: 'Led development of microservices architecture.',
          },
        ],
        education: [
          {
            id: 'edu-1',
            institution: 'University of California',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2015-09',
            endDate: '2019-05',
            gpa: '3.8',
          },
        ],
        skills: [
          {
            id: 'skill-1',
            name: 'JavaScript',
            category: 'Programming Languages',
          },
          {
            id: 'skill-2',
            name: 'React',
            category: 'Frontend',
          },
        ],
        projects: [
          {
            id: 'proj-1',
            name: 'E-Commerce Platform',
            description: 'Built a full-stack e-commerce platform.',
            technologies: ['React', 'Node.js'],
            url: 'https://example.com/project',
            github: 'https://github.com/user/project',
          },
        ],
        achievements: [
          {
            id: 'ach-1',
            title: 'Outstanding Performance Award',
            description: 'Recognized for exceptional contributions.',
            date: '2023',
          },
        ],
        extras: {
          languages: ['English (Native)', 'Spanish (Conversational)'],
          certifications: ['AWS Certified Solutions Architect'],
          interests: ['Open Source', 'Machine Learning'],
        },
      }

      const result = resumeSchema.parse(completeResume)
      expect(result.personal.firstName).toBe('Jane')
      expect(result.personal.lastName).toBe('Smith')
      expect(result.experience).toHaveLength(1)
      expect(result.education).toHaveLength(1)
      expect(result.skills).toHaveLength(2)
      expect(result.projects).toHaveLength(1)
      expect(result.achievements).toHaveLength(1)
      expect(result.extras.languages).toHaveLength(2)
    })

    it('should parse resume with optional fields missing', () => {
      const minimalResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      }

      const result = resumeSchema.parse(minimalResume)
      expect(result.summary).toBe('')
      expect(result.experience).toEqual([])
      expect(result.education).toEqual([])
      expect(result.skills).toEqual([])
    })
  })

  describe('Invalid Resume Parsing', () => {
    it('should reject resume with missing required personal fields', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          // Missing lastName and email
        },
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject resume with invalid email', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email', // Invalid email format
        },
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject resume with invalid URL in personal fields', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          website: 'not-a-valid-url', // Invalid URL
        },
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject experience entry with missing required fields', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        experience: [
          {
            id: 'exp-1',
            company: 'Tech Corp',
            // Missing position (required)
          },
        ],
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject education entry with missing required fields', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        education: [
          {
            id: 'edu-1',
            institution: 'University',
            // Missing degree (required)
          },
        ],
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject empty firstName', () => {
      const invalidResume = {
        personal: {
          firstName: '', // Empty string not allowed
          lastName: 'Doe',
          email: 'john@example.com',
        },
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })

    it('should reject empty lastName', () => {
      const invalidResume = {
        personal: {
          firstName: 'John',
          lastName: '', // Empty string not allowed
          email: 'john@example.com',
        },
      }

      expect(() => resumeSchema.parse(invalidResume)).toThrow()
    })
  })

  describe('URL Validation', () => {
    it('should accept empty string for optional URLs', () => {
      const resume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          website: '',
          linkedin: '',
          github: '',
        },
      }

      const result = resumeSchema.parse(resume)
      expect(result.personal.website).toBe('')
      expect(result.personal.linkedin).toBe('')
      expect(result.personal.github).toBe('')
    })

    it('should accept valid URLs', () => {
      const resume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          website: 'https://johndoe.dev',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
        },
      }

      const result = resumeSchema.parse(resume)
      expect(result.personal.website).toBe('https://johndoe.dev')
      expect(result.personal.linkedin).toBe('https://linkedin.com/in/johndoe')
      expect(result.personal.github).toBe('https://github.com/johndoe')
    })
  })

  describe('Array Fields', () => {
    it('should handle empty arrays', () => {
      const resume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        achievements: [],
      }

      const result = resumeSchema.parse(resume)
      expect(result.experience).toEqual([])
      expect(result.education).toEqual([])
      expect(result.skills).toEqual([])
      expect(result.projects).toEqual([])
      expect(result.achievements).toEqual([])
    })

    it('should handle multiple entries in arrays', () => {
      const resume = {
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        experience: [
          {
            id: 'exp-1',
            company: 'Company 1',
            position: 'Position 1',
          },
          {
            id: 'exp-2',
            company: 'Company 2',
            position: 'Position 2',
          },
        ],
        skills: [
          { id: 'skill-1', name: 'JavaScript' },
          { id: 'skill-2', name: 'TypeScript' },
          { id: 'skill-3', name: 'React' },
        ],
      }

      const result = resumeSchema.parse(resume)
      expect(result.experience).toHaveLength(2)
      expect(result.skills).toHaveLength(3)
    })
  })
})

