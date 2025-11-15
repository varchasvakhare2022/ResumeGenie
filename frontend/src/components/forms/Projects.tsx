import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import SuggestModal from '../SuggestModal'

export default function Projects() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)

  const handleAdd = () => {
    addProject({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
    })
  }

  const handleOpenModal = (projectId: string) => {
    setCurrentProjectId(projectId)
    setIsModalOpen(true)
  }

  const handleInsertSuggestions = (suggestions: string[]) => {
    if (!suggestions || suggestions.length === 0) {
      console.warn('No suggestions to insert')
      return
    }
    
    if (currentProjectId) {
      const project = resume.projects.find((p) => p.id === currentProjectId)
      if (project) {
        const currentDesc = project.description || ''
        const newDesc = suggestions.join('\n')
        const updatedDesc = currentDesc
          ? `${currentDesc}\n${newDesc}`
          : newDesc
        updateProject(currentProjectId, { description: updatedDesc })
      } else {
        console.error('Project not found:', currentProjectId)
      }
    } else {
      console.error('No project ID set for insertion')
    }
  }

  return (
    <>
      <div className="space-y-4">
        {resume.projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Project</h3>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
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
                  onClick={() => handleOpenModal(project.id)}
                  className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-secondary"
                >
                  <Sparkles size={14} />
                  AI Assist
                </button>
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                placeholder="Describe your project..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => updateProject(project.id, { url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  value={project.github}
                  onChange={(e) => updateProject(project.id, { github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {currentProjectId && (
        <SuggestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setCurrentProjectId(null)
          }}
          onInsert={handleInsertSuggestions}
          task="rewrite"
          sourceText={resume.projects.find((p) => p.id === currentProjectId)?.description || resume.projects.find((p) => p.id === currentProjectId)?.name || ''}
          title="Improve Project Description"
        />
      )}
    </>
  )
}

