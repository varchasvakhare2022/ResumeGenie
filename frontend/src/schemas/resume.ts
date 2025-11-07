import { z } from 'zod'

export const experienceItemSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().default('Present'),
  location: z.string().default('Remote'),
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty')).min(1, 'Add at least one achievement'),
})

export const educationItemSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().default(''),
  details: z.string().default(''),
})

export const projectItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

export const resumeSchema = z.object({
  personal: z.object({
    fullName: z.string().min(1, 'Name is required'),
    headline: z.string().min(1, 'Headline is required'),
    email: z.string().email('Provide a valid email'),
    phone: z.string().min(1, 'Phone is required'),
    location: z.string().min(1, 'Location is required'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
  summary: z.string().min(1, 'Summary is required'),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'Add at least one skill'),
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  projects: z.array(projectItemSchema),
  achievements: z.array(z.string().min(1, 'Achievement cannot be empty')),
  extras: z.array(z.string().min(1, 'Entry cannot be empty')),
})

export type ResumeData = z.infer<typeof resumeSchema>

export const defaultResumeData: ResumeData = {
  personal: {
    fullName: 'Jordan Rivera',
    headline: 'Product Designer · AI-Driven Experiences',
    email: 'jordan.rivera@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://jordandesigns.com',
  },
  summary:
    'Design leader crafting AI-powered tools that balance usability with measurable outcomes. Trusted to ship end-to-end experiences across growth-stage startups and enterprise platforms.',
  skills: ['Product Strategy', 'User Research', 'Prototyping', 'Figma', 'Design Systems', 'AI Copilots'],
  experience: [
    {
      company: 'Atlas AI Suite',
      role: 'Lead Product Designer',
      startDate: 'Jan 2022',
      endDate: 'Present',
      location: 'Remote',
      achievements: [
        'Led design for resume intelligence product adopted by 400+ talent teams',
        'Improved candidate match accuracy by 28% through ATS signal experiments',
        'Built design system powering three cross-platform launches in 9 months',
      ],
    },
    {
      company: 'Northwind Labs',
      role: 'Senior UX Designer',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      location: 'New York, NY',
      achievements: [
        'Owned end-to-end redesign of analytics suite increasing retention by 18%',
        'Partnered with data science to visualize predictive hiring insights',
      ],
    },
  ],
  education: [
    {
      school: 'Parsons School of Design',
      degree: 'BFA, Communication Design',
      startDate: '2012',
      endDate: '2016',
      details: 'Graduated with Honors · Design Lead for Interaction Lab',
    },
  ],
  projects: [
    {
      name: 'ResumeGenie Builder',
      description: 'Collaborative resume editor with live ATS insights and multi-template exports.',
      link: 'https://resumegenie.ai',
    },
  ],
  achievements: [
    'Speaker, UXDX 2024 – Designing trustworthy AI copilots',
    'Winner, Adobe Creative Jam – AI Design Systems',
  ],
  extras: ['Mentor @ ADPList', 'Fluent in Spanish'],
}


