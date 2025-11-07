import type { ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ResumeData } from '../../schemas/resume'
import { StepHeader } from '../StepHeader'

export const SkillsForm = () => {
  const { setValue, watch } = useFormContext<ResumeData>()
  const skills = watch('skills') ?? []

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const entries = event.currentTarget.value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
    setValue('skills', entries, { shouldDirty: true })
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Skills & Tools"
        description="Enter one skill per line. The preview clusters them automatically."
      />
      <textarea
        value={skills.join('\n')}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
      />
      <p className="text-xs text-slate-500">Example: Product Strategy, Figma, AI Copilots.</p>
    </div>
  )
}


