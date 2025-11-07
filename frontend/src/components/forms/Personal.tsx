import { useFormContext } from 'react-hook-form'
import { StepHeader } from '../StepHeader'
import type { ResumeData } from '../../schemas/resume'
import { UserIcon } from 'lucide-react'

export const PersonalForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeData>()

  return (
    <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <StepHeader
        title="Personal Details"
        description="Core contact details and professional headline."
        icon={UserIcon}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Full Name</span>
          <input
            {...register('personal.fullName')}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.fullName ? (
            <span className="text-xs text-rose-400">{errors.personal.fullName.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Headline</span>
          <input
            {...register('personal.headline')}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.headline ? (
            <span className="text-xs text-rose-400">{errors.personal.headline.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Email</span>
          <input
            {...register('personal.email')}
            type="email"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.email ? (
            <span className="text-xs text-rose-400">{errors.personal.email.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Phone</span>
          <input
            {...register('personal.phone')}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.phone ? (
            <span className="text-xs text-rose-400">{errors.personal.phone.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Location</span>
          <input
            {...register('personal.location')}
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.location ? (
            <span className="text-xs text-rose-400">{errors.personal.location.message}</span>
          ) : null}
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-slate-300">Website</span>
          <input
            {...register('personal.website')}
            placeholder="https://"
            className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-indigo-400"
          />
          {errors.personal?.website ? (
            <span className="text-xs text-rose-400">{errors.personal.website.message}</span>
          ) : null}
        </label>
      </div>
    </div>
  )
}


