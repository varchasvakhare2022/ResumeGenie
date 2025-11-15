import { Check } from 'lucide-react'

interface StepperProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex items-center min-w-max gap-3">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isClickable = onStepClick && (isCompleted || isCurrent)

            return (
              <div key={index} className="flex items-center flex-shrink-0">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors flex-shrink-0 ${
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
                      <span className="font-semibold text-sm">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <div
                    className={`mt-2 max-w-[100px] ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                    onClick={() => isClickable && onStepClick?.(index)}
                  >
                    <div
                      className={`text-xs font-medium text-center leading-tight ${
                        isCurrent ? 'text-brand-primary' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                      }`}
                      title={step}
                    >
                      {step}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-10 md:w-16 h-0.5 mx-2 flex-shrink-0 ${
                      isCompleted ? 'bg-brand-primary' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

