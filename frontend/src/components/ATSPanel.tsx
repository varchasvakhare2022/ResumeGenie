import { useState, useEffect } from 'react'
import { useResumeStore } from '../store/useResumeStore'
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { atsScore, type ATSResponse } from '../lib/api'
import { useDebounce } from '../hooks/useDebounce'

export default function ATSPanel() {
  const { resume } = useResumeStore()
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<ATSResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Debounce job description for auto-analysis
  const debouncedJobDesc = useDebounce(jobDescription, 800)
  const debouncedResume = useDebounce(resume, 800)

  // Auto-analyze when job description or resume changes
  useEffect(() => {
    if (!debouncedJobDesc.trim()) {
      setScore(null)
      setError(null)
      return
    }

    const analyze = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await atsScore(debouncedResume, debouncedJobDesc)
        setScore(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze resume')
        console.error('ATS analysis error:', err)
      } finally {
        setLoading(false)
      }
    }

    analyze()
  }, [debouncedJobDesc, debouncedResume])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">ResumeGenie Score</h2>
        {loading && <Loader2 className="animate-spin text-brand-primary" size={20} />}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description (optional)
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Paste the job description here for ATS analysis..."
        />
        <p className="text-xs text-gray-500 mt-1">
          {jobDescription.trim() ? 'Analyzing automatically...' : 'Enter a job description to get ATS score'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2 text-red-700">
          <XCircle size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {score && (
        <div className="space-y-4 mt-4">
          {/* Score */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-brand-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-800">Overall Score</span>
              <span className={`text-4xl font-bold ${
                score.score >= 80 ? 'text-green-600' :
                score.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score.score}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-3 shadow-inner">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  score.score >= 80 ? 'bg-green-500' :
                  score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${score.score}%` }}
              />
            </div>
          </div>

          {/* Breakdown */}
          {score.breakdown && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 text-gray-800">Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Keywords:</span>
                  <span className="ml-2 font-semibold">{score.breakdown.keywords}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Action Verbs:</span>
                  <span className="ml-2 font-semibold">{score.breakdown.verbs}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Metrics:</span>
                  <span className="ml-2 font-semibold">{score.breakdown.metrics}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Sections:</span>
                  <span className="ml-2 font-semibold">{score.breakdown.sections}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          {score.tips && score.tips.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <AlertCircle size={18} className="text-brand-primary" />
                Improvement Tips
              </h3>
              <ul className="space-y-2">
                {score.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 p-3 rounded-md">
                    <CheckCircle2 size={16} className="text-brand-primary mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!jobDescription.trim() && !loading && !score && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle size={48} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Enter a job description to see your ATS score</p>
        </div>
      )}
    </div>
  )
}

