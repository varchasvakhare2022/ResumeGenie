import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useResumeStore } from '../../store/useResumeStore'
import { Sparkles } from 'lucide-react'
import SuggestModal from '../SuggestModal'
import { useAutoSave } from '../../hooks/useAutoSave'

interface SummaryFormData {
  summary: string
}

export default function Summary() {
  const { resume, updateSummary } = useResumeStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { register, setValue, watch } = useForm<SummaryFormData>({
    defaultValues: { summary: resume.summary || '' },
    mode: 'onChange',
  })

  const summaryValue = watch('summary')

  // Auto-save to Zustand with 400ms debounce
  useAutoSave(summaryValue, (value) => {
    updateSummary(value)
  }, 400)

  const handleInsertSuggestions = (suggestions: string[]) => {
    if (!suggestions || suggestions.length === 0) {
      console.warn('No suggestions to insert')
      return
    }
    
    const currentSummary = summaryValue || ''
    // For summary, combine suggestions into a cohesive paragraph
    const newSummary = currentSummary
      ? `${currentSummary} ${suggestions.join(' ')}`
      : suggestions.join(' ')
    
    // Update both form and store
    setValue('summary', newSummary, { shouldValidate: true, shouldDirty: true })
    updateSummary(newSummary)
    
    // Force form to recognize the change
    setTimeout(() => {
      const formValue = watch('summary')
      if (formValue !== newSummary) {
        setValue('summary', newSummary, { shouldValidate: true })
      }
    }, 50)
  }

  return (
    <>
      <form className="space-y-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-secondary"
          >
            <Sparkles size={16} />
            AI Assist
          </button>
        </div>
        <textarea
          {...register('summary')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Write a brief summary of your professional background and key achievements..."
        />
      </form>

      <SuggestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsertSuggestions}
        task="summary"
        sourceText={summaryValue || ''}
        title="Generate Professional Summary"
      />
    </>
  )
}

