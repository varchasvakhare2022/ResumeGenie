import { useResumeStore } from '../../store/useResumeStore'
import { Plus, Trash2 } from 'lucide-react'

export default function Skills() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore()

  const handleAdd = () => {
    addSkill({
      id: crypto.randomUUID(),
      name: '',
      category: '',
    })
  }

  return (
    <div className="space-y-4">
      {resume.skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-4">
          <div className="flex-1">
            <input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="Skill name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="flex-1">
            <input
              value={skill.category}
              onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
              placeholder="Category (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => removeSkill(skill.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary"
      >
        <Plus size={18} />
        Add Skill
      </button>
    </div>
  )
}

