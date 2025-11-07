import type { ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ResumeData } from '../../schemas/resume'
import { StepHeader } from '../StepHeader'

export const AchievementsForm = () => {
  const { setValue, watch } = useFormContext<ResumeData>()
  const achievements = watch('achievements') ?? []

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const entries = event.currentTarget.value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
    setValue('achievements', entries, { shouldDirty: true })
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Achievements"
        description="One per line. Think awards, talks, publications, or benchmark wins."
      />
      <textarea
        value={achievements.join('\n')}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
      />
      <p className="text-xs text-slate-500">Short, outcome-focused statements land best.</p>
    </div>
  )
}


