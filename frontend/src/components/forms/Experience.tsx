import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import SuggestModal from '../SuggestModal'

export default function Experience() {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentExpId, setCurrentExpId] = useState<string | null>(null)

  const handleAdd = () => {
    addExperience({
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
  }

  const handleOpenModal = (expId: string) => {
    setCurrentExpId(expId)
    setIsModalOpen(true)
  }

  const handleInsertSuggestions = (suggestions: string[]) => {
    if (!suggestions || suggestions.length === 0) {
      console.warn('No suggestions to insert')
      return
    }
    
    if (currentExpId) {
      const exp = resume.experience.find((e) => e.id === currentExpId)
      if (exp) {
        const currentDesc = exp.description || ''
        // Format bullet points properly
        const formattedSuggestions = suggestions.map((s) => {
          // Remove existing bullet markers and trim
          const cleaned = s.replace(/^[•\-\*]\s*/, '').trim()
          return `• ${cleaned}`
        })
        const newDesc = formattedSuggestions.join('\n')
        const updatedDesc = currentDesc
          ? `${currentDesc}\n${newDesc}`
          : newDesc
        updateExperience(currentExpId, { description: updatedDesc })
      } else {
        console.error('Experience not found:', currentExpId)
      }
    } else {
      console.error('No experience ID set for insertion')
    }
  }

  return (
    <>
      <div className="space-y-4">
        {resume.experience.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Experience</h3>
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:bg-gray-100"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Current position</label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  type="button"
                  onClick={() => handleOpenModal(exp.id)}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-secondary"
                >
                  <Sparkles size={14} />
                  AI Assist
                </button>
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      {currentExpId && (
        <SuggestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setCurrentExpId(null)
          }}
          onInsert={handleInsertSuggestions}
          task="bullet"
          sourceText={resume.experience.find((e) => e.id === currentExpId)?.description || resume.experience.find((e) => e.id === currentExpId)?.position || ''}
          title="Generate Bullet Points"
        />
      )}
    </>
  )
}

