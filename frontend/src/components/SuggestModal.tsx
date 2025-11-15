import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { suggest, type SuggestRequest } from '../lib/api'

interface SuggestModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (suggestions: string[]) => void
  task: 'bullet' | 'summary' | 'skills' | 'rewrite'
  sourceText: string
  title: string
}

export default function SuggestModal({
  isOpen,
  onClose,
  onInsert,
  task,
  sourceText,
  title,
}: SuggestModalProps) {
  const [role, setRole] = useState('')
  const [level, setLevel] = useState<'junior' | 'mid' | 'senior' | 'entry' | 'intern'>('mid')
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleGenerate = async () => {
    // Allow generation even with empty sourceText for some tasks like summary
    if (!sourceText.trim() && task !== 'summary') {
      setError('Please provide source text')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions([])
    setSelectedSuggestions(new Set())

    try {
      const request: SuggestRequest = {
        task,
        sourceText: sourceText.trim() || (task === 'summary' ? 'Generate a professional summary' : ''),
        role: role.trim() || undefined,
        level: level || undefined,
        jobDesc: jobDesc.trim() || undefined,
        count: task === 'bullet' ? 4 : task === 'summary' ? 3 : 5,
      }

      const response = await suggest(request)
      setSuggestions(response.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedSuggestions(newSelected)
  }

  const handleInsert = () => {
    const selected = suggestions.filter((_, index) => selectedSuggestions.has(index))
    if (selected.length > 0) {
      try {
        onInsert(selected)
        onClose()
      } catch (error) {
        console.error('Error inserting suggestions:', error)
        setError('Failed to insert suggestions. Please try again.')
      } finally {
        // Reset state after a brief delay to allow insertion to complete
        setTimeout(() => {
          setSuggestions([])
          setSelectedSuggestions(new Set())
          setError(null)
        }, 100)
      }
    }
  }

  const handleClose = () => {
    onClose()
    // Reset state
    setSuggestions([])
    setSelectedSuggestions(new Set())
    setError(null)
    setRole('')
    setJobDesc('')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Input fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Role (optional)
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Software Engineer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level (optional)
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as typeof level)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                <option value="entry">Entry Level</option>
                <option value="intern">Intern</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description (optional)
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={3}
                placeholder="Paste job description for better context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating suggestions...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Suggestions
              </>
            )}
          </button>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Suggestions list */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Select suggestions to insert:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <label
                    key={index}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSuggestions.has(index)}
                      onChange={() => handleToggleSuggestion(index)}
                      className="mt-1"
                    />
                    <span className="flex-1 text-sm text-gray-700">{suggestion}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          {suggestions.length > 0 && (
            <button
              onClick={handleInsert}
              disabled={selectedSuggestions.size === 0 || loading}
              className="px-5 py-2.5 bg-brand-primary text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Insert Selected ({selectedSuggestions.size})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

