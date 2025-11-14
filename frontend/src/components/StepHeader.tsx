interface StepHeaderProps {
  title: string
  description?: string
  step?: number
  totalSteps?: number
}

export default function StepHeader({ title, description, step, totalSteps }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {step && totalSteps && (
        <div className="text-sm text-gray-500 mb-2">
          Step {step} of {totalSteps}
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  )
}

