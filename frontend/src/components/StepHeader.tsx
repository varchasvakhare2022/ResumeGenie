import { LucideIcon } from 'lucide-react'

interface StepHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export const StepHeader = ({ title, description, icon: Icon }: StepHeaderProps) => {
  return (
    <div className="flex items-start gap-3">
      {Icon ? (
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-indigo-200">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description ? <p className="text-xs text-slate-400">{description}</p> : null}
      </div>
    </div>
  )
}


