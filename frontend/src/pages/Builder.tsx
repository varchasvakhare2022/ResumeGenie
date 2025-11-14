import { useState, useRef } from 'react'
import { useResumeStore } from '../store/useResumeStore'
import Stepper from '../components/Stepper'
import StepHeader from '../components/StepHeader'
import TemplatePicker, { type TemplateType } from '../components/TemplatePicker'
import ExportButton from '../components/ExportButton'
import ATSPanel from '../components/ATSPanel'
import Personal from '../components/forms/Personal'
import Summary from '../components/forms/Summary'
import Experience from '../components/forms/Experience'
import Education from '../components/forms/Education'
import Skills from '../components/forms/Skills'
import Projects from '../components/forms/Projects'
import Achievements from '../components/forms/Achievements'
import Extras from '../components/forms/Extras'
import ClassicA from '../components/Preview/ClassicA'
import ModernB from '../components/Preview/ModernB'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'

const STEPS = [
  'Personal Info',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Projects',
  'Achievements',
  'Extras',
]

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('ClassicA')
  const previewRef = useRef<HTMLDivElement>(null)
  const { loadDemoResume } = useResumeStore()

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Personal />
      case 1:
        return <Summary />
      case 2:
        return <Experience />
      case 3:
        return <Education />
      case 4:
        return <Skills />
      case 5:
        return <Projects />
      case 6:
        return <Achievements />
      case 7:
        return <Extras />
      default:
        return <Personal />
    }
  }

  const renderPreview = () => {
    switch (selectedTemplate) {
      case 'ClassicA':
        return <ClassicA ref={previewRef} />
      case 'ModernB':
        return <ModernB ref={previewRef} />
      default:
        return <ClassicA ref={previewRef} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ResumeGenie</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={loadDemoResume}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Download size={18} />
                Load Demo
              </button>
              <ExportButton contentRef={previewRef} />
            </div>
          </div>
          <div className="mt-4">
            <TemplatePicker
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            {/* Stepper */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Stepper
                steps={STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <StepHeader
                title={STEPS[currentStep]}
                step={currentStep + 1}
                totalSteps={STEPS.length}
              />
              {renderStepContent()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === STEPS.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Preview & ATS */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
              </div>
              <div className="overflow-auto max-h-[calc(100vh-400px)] border border-gray-200 rounded-lg p-4 bg-gray-50">
                {renderPreview()}
              </div>
            </div>

            {/* ATS Panel */}
            <ATSPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
