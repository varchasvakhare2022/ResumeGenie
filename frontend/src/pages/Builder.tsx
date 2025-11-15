import { useState, useRef } from 'react'
import { useResumeStore } from '../store/useResumeStore'
import { useTheme } from '../contexts/ThemeContext'
import Stepper from '../components/Stepper'
import StepHeader from '../components/StepHeader'
import TemplatePicker, { type TemplateType } from '../components/TemplatePicker'
import ExportButton from '../components/ExportButton'
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
  const { themeConfig } = useTheme()

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toolbar - Theme-aware */}
      <div 
        className="border-b sticky top-20 z-40 shadow-sm transition-all duration-300"
        style={{
          backgroundColor: themeConfig.colors.light,
          borderColor: themeConfig.colors.primary + '30'
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={loadDemoResume}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Load Demo
              </button>
              <ExportButton contentRef={previewRef} />
            </div>
          </div>
          <div className="pb-2">
            <TemplatePicker
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Stepper - Spans full width, positioned above grid */}
        <div className="mb-6 lg:mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-stretch">
          {/* Left: Form - Takes 5 columns */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Form Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1 flex flex-col justify-between">
              <StepHeader
                title={STEPS[currentStep]}
                step={currentStep + 1}
                totalSteps={STEPS.length}
              />
              <div className="mt-6">
                {renderStepContent()}
              </div>

              {/* Navigation */}
              <div className={`flex items-center mt-8 pt-6 border-t border-gray-200 ${currentStep === 0 ? 'justify-end' : 'justify-between'}`}>
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                )}
                {currentStep < STEPS.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Preview - Takes 7 columns */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Preview - Fixed height container - Aligned with form content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full min-h-[700px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              </div>
              <div className="flex-1 overflow-hidden min-h-0">
                <div className="h-full overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="p-4 md:p-6">
                    <div className="bg-white shadow-lg rounded-lg w-full" key={selectedTemplate}>
                      {renderPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
