import { useEffect } from 'react'
import type { Resolver } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResumeData, resumeSchema } from '../schemas/resume'
import { useResumeStore } from '../store/useResumeStore'
import { PersonalForm } from '../components/forms/Personal'
import { SummaryForm } from '../components/forms/Summary'
import { SkillsForm } from '../components/forms/Skills'
import { ExperienceForm } from '../components/forms/Experience'
import { EducationForm } from '../components/forms/Education'
import { ProjectsForm } from '../components/forms/Projects'
import { AchievementsForm } from '../components/forms/Achievements'
import { ExtrasForm } from '../components/forms/Extras'
import { TemplateFrame } from '../components/Preview/TemplateFrame'
import { ClassicA } from '../components/Preview/ClassicA'
import { ModernB } from '../components/Preview/ModernB'
import { ATSPanel } from '../components/ATSPanel'

export const Builder = () => {
  const resume = useResumeStore((state) => state.resume)
  const updateResume = useResumeStore((state) => state.updateResume)
  const selectedTemplate = useResumeStore((state) => state.selectedTemplate)
  const setTemplate = useResumeStore((state) => state.setTemplate)

  const formMethods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema) as Resolver<ResumeData>,
    defaultValues: resume,
    mode: 'onChange',
  })

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      updateResume(values as ResumeData)
    })
    return () => subscription.unsubscribe()
  }, [formMethods, updateResume])

  const PreviewComponent = selectedTemplate === 'classicA' ? ClassicA : ModernB

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
      <FormProvider {...formMethods}>
        <form
          className="flex w-full flex-col gap-6 lg:w-[55%]"
          onSubmit={(event) => event.preventDefault()}
        >
          <PersonalForm />
          <SummaryForm />
          <SkillsForm />
          <ExperienceForm />
          <EducationForm />
          <ProjectsForm />
          <AchievementsForm />
          <ExtrasForm />
        </form>
      </FormProvider>
      <div className="flex w-full flex-col gap-6 lg:w-[45%]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Live Preview</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 p-1">
            {(
              [
                { key: 'classicA', label: 'Classic A' },
                { key: 'modernB', label: 'Modern B' },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setTemplate(option.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedTemplate === option.key
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <TemplateFrame>
          <PreviewComponent />
        </TemplateFrame>
        <ATSPanel />
      </div>
    </div>
  )
}


