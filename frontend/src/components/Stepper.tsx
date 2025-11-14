import { Check } from 'lucide-react'

interface StepperProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = onStepClick && (isCompleted || isCurrent)

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted
                    ? 'bg-brand-primary border-brand-primary text-white'
                    : isCurrent
                    ? 'border-brand-primary text-brand-primary bg-white'
                    : 'border-gray-300 text-gray-400 bg-white'
                } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                onClick={() => isClickable && onStepClick?.(index)}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span className="font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div
                className={`ml-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && onStepClick?.(index)}
              >
                <div
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-brand-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-brand-primary' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

