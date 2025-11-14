import { useResumeStore } from '../../store/useResumeStore'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

export default function Extras() {
  const { resume, updateExtras } = useResumeStore()
  const [newLanguage, setNewLanguage] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newInterest, setNewInterest] = useState('')

  const addLanguage = () => {
    if (newLanguage.trim()) {
      updateExtras({
        languages: [...resume.extras.languages, newLanguage.trim()],
      })
      setNewLanguage('')
    }
  }

  const removeLanguage = (index: number) => {
    updateExtras({
      languages: resume.extras.languages.filter((_, i) => i !== index),
    })
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      updateExtras({
        certifications: [...resume.extras.certifications, newCertification.trim()],
      })
      setNewCertification('')
    }
  }

  const removeCertification = (index: number) => {
    updateExtras({
      certifications: resume.extras.certifications.filter((_, i) => i !== index),
    })
  }

  const addInterest = () => {
    if (newInterest.trim()) {
      updateExtras({
        interests: [...resume.extras.interests, newInterest.trim()],
      })
      setNewInterest('')
    }
  }

  const removeInterest = (index: number) => {
    updateExtras({
      interests: resume.extras.interests.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            placeholder="Add language"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="button"
            onClick={addLanguage}
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.extras.languages.map((lang, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            placeholder="Add certification"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="button"
            onClick={addCertification}
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.extras.certifications.map((cert, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {cert}
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests
        </label>
        <div className="flex gap-2 mb-2">
          <input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            placeholder="Add interest"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.extras.interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

