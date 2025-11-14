import { z } from 'zod'

export const resumeSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    github: z.string().url('Invalid URL').optional().or(z.literal('')),
  }),
  summary: z.string().optional(),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, 'Company name is required'),
      position: z.string().min(1, 'Position is required'),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      current: z.boolean().default(false),
      description: z.string().optional(),
    })
  ).default([]),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(1, 'Institution name is required'),
      degree: z.string().min(1, 'Degree is required'),
      field: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      gpa: z.string().optional(),
    })
  ).default([]),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Skill name is required'),
      category: z.string().optional(),
    })
  ).default([]),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Project name is required'),
      description: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      url: z.string().url('Invalid URL').optional().or(z.literal('')),
      github: z.string().url('Invalid URL').optional().or(z.literal('')),
    })
  ).default([]),
  achievements: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, 'Achievement title is required'),
      description: z.string().optional(),
      date: z.string().optional(),
    })
  ).default([]),
  extras: z.object({
    languages: z.array(z.string()).default([]),
    certifications: z.array(z.string()).default([]),
    interests: z.array(z.string()).default([]),
  }).default({}),
})

export type Resume = z.infer<typeof resumeSchema>

export const defaultResume: Resume = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
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

// Helper function to generate demo resume with fresh IDs
export function getDemoResume(): Resume {
  return {
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
    },
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about building scalable web applications and leading cross-functional teams to deliver high-quality products.',
    experience: [
      {
        id: crypto.randomUUID(),
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: 'Led development of microservices architecture serving 1M+ users\n• Improved system performance by 40% through optimization and caching\n• Mentored 3 junior engineers and conducted code reviews\n• Implemented CI/CD pipelines reducing deployment time by 60%',
      },
      {
        id: crypto.randomUUID(),
        company: 'Startup Inc',
        position: 'Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: '2019-06',
        endDate: '2020-12',
        current: false,
        description: 'Developed responsive web applications using React and Node.js\n• Built RESTful APIs handling 100K+ requests per day\n• Collaborated with design team to implement pixel-perfect UI components\n• Reduced page load time by 50% through code splitting and optimization',
      },
    ],
    education: [
      {
        id: crypto.randomUUID(),
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: '2015-09',
        endDate: '2019-05',
        gpa: '3.8/4.0',
      },
    ],
    skills: [
      { id: crypto.randomUUID(), name: 'JavaScript', category: 'Programming Languages' },
      { id: crypto.randomUUID(), name: 'TypeScript', category: 'Programming Languages' },
      { id: crypto.randomUUID(), name: 'React', category: 'Frontend' },
      { id: crypto.randomUUID(), name: 'Node.js', category: 'Backend' },
      { id: crypto.randomUUID(), name: 'Python', category: 'Programming Languages' },
      { id: crypto.randomUUID(), name: 'AWS', category: 'Cloud' },
      { id: crypto.randomUUID(), name: 'Docker', category: 'DevOps' },
      { id: crypto.randomUUID(), name: 'MongoDB', category: 'Database' },
    ],
    projects: [
      {
        id: crypto.randomUUID(),
        name: 'E-Commerce Platform',
        description: 'Built a full-stack e-commerce platform with payment integration and inventory management. Features include user authentication, product catalog, shopping cart, and order processing.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        url: 'https://example.com/ecommerce',
        github: 'https://github.com/johndoe/ecommerce',
      },
      {
        id: crypto.randomUUID(),
        name: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates and team collaboration features. Supports multiple projects, task assignments, and progress tracking.',
        technologies: ['React', 'TypeScript', 'Firebase', 'Material-UI'],
        url: 'https://example.com/tasks',
        github: 'https://github.com/johndoe/tasks',
      },
    ],
    achievements: [
      {
        id: crypto.randomUUID(),
        title: 'Outstanding Performance Award',
        description: 'Recognized for exceptional contributions to product development and team leadership',
        date: '2023',
      },
      {
        id: crypto.randomUUID(),
        title: 'Hackathon Winner',
        description: 'First place in company-wide hackathon for innovative solution to customer support automation',
        date: '2022',
      },
    ],
    extras: {
      languages: ['English (Native)', 'Spanish (Conversational)'],
      certifications: ['AWS Certified Solutions Architect', 'Certified Scrum Master'],
      interests: ['Open Source Contributions', 'Machine Learning', 'Photography'],
    },
  }
}

