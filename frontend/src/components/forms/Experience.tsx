import type { ChangeEvent } from 'react'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import type { ResumeData } from '../../schemas/resume'
import { StepHeader } from '../StepHeader'

const ExperienceItem = ({ index, remove }: { index: number; remove: (index: number) => void }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ResumeData>()

  const achievements = useWatch({
    control,
    name: `experience.${index}.achievements` as const,
  }) ?? []

  const fieldErrors = errors.experience?.[index]

  const handleAchievementsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const entries = event.currentTarget.value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
    setValue(`experience.${index}.achievements`, entries, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800/70 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Position {index + 1}</h4>
        <button
          type="button"
          onClick={() => remove(index)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400 hover:border-rose-500/60 hover:text-rose-300"
        >
          <Trash2Icon className="h-3 w-3" /> Remove
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs">
          <span className="text-slate-300">Company</span>
          <input
            {...register(`experience.${index}.company` as const)}
            className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          {fieldErrors?.company ? (
            <span className="text-rose-400">{fieldErrors.company.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-xs">
          <span className="text-slate-300">Role</span>
          <input
            {...register(`experience.${index}.role` as const)}
            className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          {fieldErrors?.role ? <span className="text-rose-400">{fieldErrors.role.message}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-xs">
          <span className="text-slate-300">Start date</span>
          <input
            {...register(`experience.${index}.startDate` as const)}
            placeholder="Jan 2023"
            className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          {fieldErrors?.startDate ? (
            <span className="text-rose-400">{fieldErrors.startDate.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-xs">
          <span className="text-slate-300">End date</span>
          <input
            {...register(`experience.${index}.endDate` as const)}
            placeholder="Present"
            className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
          {fieldErrors?.endDate ? <span className="text-rose-400">{fieldErrors.endDate.message}</span> : null}
        </label>
        <label className="flex flex-col gap-2 text-xs">
          <span className="text-slate-300">Location</span>
          <input
            {...register(`experience.${index}.location` as const)}
            placeholder="Remote"
            className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-xs">
        <span className="text-slate-300">Key achievements (one per line)</span>
        <textarea
          value={achievements.join('\n')}
          onChange={handleAchievementsChange}
          rows={3}
          className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
        />
      </label>
    </div>
  )
}

export const ExperienceForm = () => {
  const { control } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray<ResumeData, 'experience', 'id'>({
    control,
    name: 'experience',
  })

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Experience"
        description="Highlight recent roles with quantifiable impact."
      />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <ExperienceItem key={field.id} index={index} remove={remove} />
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          append({
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            location: 'Remote',
            achievements: [''],
          })
        }
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
      >
        <PlusIcon className="h-4 w-4" /> Add role
      </button>
    </div>
  )
}


