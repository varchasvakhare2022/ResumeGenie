import { useFormContext } from 'react-hook-form'
import { StepHeader } from '../StepHeader'
import type { ResumeData } from '../../schemas/resume'
import { SparklesIcon } from 'lucide-react'

export const SummaryForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeData>()

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Professional Summary"
        description="Give recruiters a crisp overview anchored in outcomes."
        icon={SparklesIcon}
      />
      <div className="space-y-2 text-sm">
        <textarea
          {...register('summary')}
          rows={4}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
        />
        {errors.summary ? <span className="text-xs text-rose-400">{errors.summary.message}</span> : null}
      </div>
    </div>
  )
}


