import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import SuggestModal from '../SuggestModal'

export default function Achievements() {
  const { resume, addAchievement, updateAchievement, removeAchievement } = useResumeStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentAchievementId, setCurrentAchievementId] = useState<string | null>(null)

  const handleAdd = () => {
    addAchievement({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      date: '',
    })
  }

  const handleOpenModal = (achievementId: string) => {
    setCurrentAchievementId(achievementId)
    setIsModalOpen(true)
  }

  const handleInsertSuggestions = (suggestions: string[]) => {
    if (!suggestions || suggestions.length === 0) {
      console.warn('No suggestions to insert')
      return
    }
    
    if (currentAchievementId) {
      const achievement = resume.achievements.find((a) => a.id === currentAchievementId)
      if (achievement) {
        const currentDesc = achievement.description || ''
        const newDesc = suggestions.join('\n')
        const updatedDesc = currentDesc
          ? `${currentDesc}\n${newDesc}`
          : newDesc
        updateAchievement(currentAchievementId, { description: updatedDesc })
      } else {
        console.error('Achievement not found:', currentAchievementId)
      }
    } else {
      console.error('No achievement ID set for insertion')
    }
  }

  return (
    <>
      <div className="space-y-4">
        {resume.achievements.map((achievement) => (
          <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Achievement</h3>
              <button
                type="button"
                onClick={() => removeAchievement(achievement.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                value={achievement.title}
                onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <button
                  type="button"
                  onClick={() => handleOpenModal(achievement.id)}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-secondary"
                >
                  <Sparkles size={14} />
                  AI Assist
                </button>
              </div>
              <textarea
                value={achievement.description}
                onChange={(e) => updateAchievement(achievement.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Describe your achievement..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={achievement.date}
                onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
          Add Achievement
        </button>
      </div>

      {currentAchievementId && (
        <SuggestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setCurrentAchievementId(null)
          }}
          onInsert={handleInsertSuggestions}
          task="bullet"
          sourceText={resume.achievements.find((a) => a.id === currentAchievementId)?.description || resume.achievements.find((a) => a.id === currentAchievementId)?.title || ''}
          title="Generate Achievement Description"
        />
      )}
    </>
  )
}

