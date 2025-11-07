import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ResumeData } from '../schemas/resume'
import { defaultResumeData } from '../schemas/resume'

type TemplateVariant = 'classicA' | 'modernB'

interface ResumeState {
  resume: ResumeData
  selectedTemplate: TemplateVariant
  previewRef: HTMLDivElement | null
  updateResume: (payload: ResumeData) => void
  setTemplate: (template: TemplateVariant) => void
  setPreviewRef: (ref: HTMLDivElement | null) => void
}

export const useResumeStore = create<ResumeState>()(
  devtools((set) => ({
    resume: defaultResumeData,
    selectedTemplate: 'classicA',
    previewRef: null,
    updateResume: (payload) => set({ resume: payload }),
    setTemplate: (template) => set({ selectedTemplate: template }),
    setPreviewRef: (ref) => set({ previewRef: ref }),
  }), { name: 'ResumeStore' }),
)


