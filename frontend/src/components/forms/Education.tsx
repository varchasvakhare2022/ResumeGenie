import { PlusIcon, Trash2Icon } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import type { ResumeData } from '../../schemas/resume'
import { StepHeader } from '../StepHeader'

export const EducationForm = () => {
  const { control, register } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({ control, name: 'education' })

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Education"
        description="List programs, certifications, or notable coursework."
      />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-xl border border-slate-800/70 bg-slate-950/60 p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Program {index + 1}</h4>
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
                <span className="text-slate-300">School</span>
                <input
                  {...register(`education.${index}.school` as const)}
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs">
                <span className="text-slate-300">Degree</span>
                <input
                  {...register(`education.${index}.degree` as const)}
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs">
                <span className="text-slate-300">Start date</span>
                <input
                  {...register(`education.${index}.startDate` as const)}
                  placeholder="2018"
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs">
                <span className="text-slate-300">End date</span>
                <input
                  {...register(`education.${index}.endDate` as const)}
                  placeholder="2022"
                  className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-xs">
              <span className="text-slate-300">Details</span>
              <textarea
                {...register(`education.${index}.details` as const)}
                rows={2}
                className="rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
              />
            </label>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          append({ school: '', degree: '', startDate: '', endDate: '', details: '' })
        }
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-indigo-400 hover:text-white"
      >
        <PlusIcon className="h-4 w-4" /> Add education
      </button>
    </div>
  )
}


