import { create } from 'zustand'
import { Resume, defaultResume, getDemoResume } from '../schemas/resume'

interface ResumeStore {
  resume: Resume
  updatePersonal: (personal: Partial<Resume['personal']>) => void
  updateSummary: (summary: string) => void
  addExperience: (experience: Resume['experience'][0]) => void
  updateExperience: (id: string, experience: Partial<Resume['experience'][0]>) => void
  removeExperience: (id: string) => void
  addEducation: (education: Resume['education'][0]) => void
  updateEducation: (id: string, education: Partial<Resume['education'][0]>) => void
  removeEducation: (id: string) => void
  addSkill: (skill: Resume['skills'][0]) => void
  updateSkill: (id: string, skill: Partial<Resume['skills'][0]>) => void
  removeSkill: (id: string) => void
  addProject: (project: Resume['projects'][0]) => void
  updateProject: (id: string, project: Partial<Resume['projects'][0]>) => void
  removeProject: (id: string) => void
  addAchievement: (achievement: Resume['achievements'][0]) => void
  updateAchievement: (id: string, achievement: Partial<Resume['achievements'][0]>) => void
  removeAchievement: (id: string) => void
  updateExtras: (extras: Partial<Resume['extras']>) => void
  resetResume: () => void
  loadDemoResume: () => void
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: defaultResume,
  
  updatePersonal: (personal) =>
    set((state) => ({
      resume: {
        ...state.resume,
        personal: { ...state.resume.personal, ...personal },
      },
    })),
  
  updateSummary: (summary) =>
    set((state) => ({
      resume: { ...state.resume, summary },
    })),
  
  addExperience: (experience) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: [...state.resume.experience, experience],
      },
    })),
  
  updateExperience: (id, experience) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      },
    })),
  
  removeExperience: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.filter((exp) => exp.id !== id),
      },
    })),
  
  addEducation: (education) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: [...state.resume.education, education],
      },
    })),
  
  updateEducation: (id, education) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      },
    })),
  
  removeEducation: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((edu) => edu.id !== id),
      },
    })),
  
  addSkill: (skill) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: [...state.resume.skills, skill],
      },
    })),
  
  updateSkill: (id, skill) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.map((s) =>
          s.id === id ? { ...s, ...skill } : s
        ),
      },
    })),
  
  removeSkill: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((s) => s.id !== id),
      },
    })),
  
  addProject: (project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: [...state.resume.projects, project],
      },
    })),
  
  updateProject: (id, project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    })),
  
  removeProject: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((p) => p.id !== id),
      },
    })),
  
  addAchievement: (achievement) =>
    set((state) => ({
      resume: {
        ...state.resume,
        achievements: [...state.resume.achievements, achievement],
      },
    })),
  
  updateAchievement: (id, achievement) =>
    set((state) => ({
      resume: {
        ...state.resume,
        achievements: state.resume.achievements.map((a) =>
          a.id === id ? { ...a, ...achievement } : a
        ),
      },
    })),
  
  removeAchievement: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        achievements: state.resume.achievements.filter((a) => a.id !== id),
      },
    })),
  
  updateExtras: (extras) =>
    set((state) => ({
      resume: {
        ...state.resume,
        extras: { ...state.resume.extras, ...extras },
      },
    })),
  
  resetResume: () =>
    set({ resume: defaultResume }),
  
  loadDemoResume: () =>
    set({ resume: getDemoResume() }),
}))

