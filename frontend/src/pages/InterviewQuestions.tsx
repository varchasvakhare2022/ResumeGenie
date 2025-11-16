import { useRef, useState } from 'react'
import { MessageSquare, Brain, Code, Users, Loader2, AlertCircle, ChevronDown, ChevronUp, Sparkles, Upload, X } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { generateInterviewQuestionsFromFile, type InterviewQuestionsResponse, type InterviewQuestion } from '../lib/api'

export default function InterviewQuestions() {
  const { themeConfig } = useTheme()
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [jobDescription, setJobDescription] = useState('')
  const [numTechQuestions, setNumTechQuestions] = useState(5)
  const [numBehavioralQuestions, setNumBehavioralQuestions] = useState(5)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<InterviewQuestionsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const handleFilePickClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const validExtensions = ['pdf', 'doc', 'docx']
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF or DOCX file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploadedFile(file)
    setUploadedFileName(file.name)
    setError(null)
  }

  const clearFile = () => {
    setUploadedFile(null)
    setUploadedFileName(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGenerate = async () => {
    // Require uploaded resume file
    if (!uploadedFile) {
      setError('Please upload a resume file (PDF or DOCX)')
      return
    }

    setLoading(true)
    setError(null)
    setQuestions(null)

    try {
      const result = await generateInterviewQuestionsFromFile({
        file: uploadedFile,
        jobDesc: jobDescription || undefined,
        numTechQuestions,
        numBehavioralQuestions,
      })
      setQuestions(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate interview questions')
      console.error('Interview questions generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = (q: InterviewQuestion, index: number, category: string) => {
    const questionId = `${category}-${index}`
    const isExpanded = expandedQuestions.has(questionId)

    return (
      <div key={questionId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => toggleQuestion(questionId)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{q.question}</h4>
              <p className="text-sm text-gray-500">Click to view suggested answer</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="flex-shrink-0 text-gray-400" size={20} />
          ) : (
            <ChevronDown className="flex-shrink-0 text-gray-400" size={20} />
          )}
        </button>
        
        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-start gap-2 mb-3">
              <Sparkles className="text-yellow-500 mt-0.5" size={16} />
              <h5 className="font-semibold text-gray-900 text-sm">Suggested Answer</h5>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{q.suggested_answer}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
            }}
          >
            <MessageSquare className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interview Question Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prepare for interviews with AI-generated technical and behavioral questions based on your resume and job description.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Questions</h2>
              
              {/* File upload */}
              <div className="mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadedFileName ? (
                  <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
                        <Upload className="text-blue-600" size={18} />
                      </div>
                      <span className="text-sm text-gray-800 truncate">{uploadedFileName}</span>
                    </div>
                    <button onClick={clearFile} className="text-gray-400 hover:text-gray-600">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleFilePickClick}
                    className="w-full py-3 px-4 border border-dashed border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    Upload Resume (PDF or DOCX)
                  </button>
                )}
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <label htmlFor="jobDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  id="jobDesc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for targeted questions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              {/* Number of Questions */}
              <div className="mb-6 space-y-4">
                <div>
                  <label htmlFor="techQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Questions
                  </label>
                  <input
                    type="number"
                    id="techQuestions"
                    min={1}
                    max={20}
                    value={numTechQuestions}
                    onChange={(e) => setNumTechQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="behavioralQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                    Behavioral Questions
                  </label>
                  <input
                    type="number"
                    id="behavioralQuestions"
                    min={1}
                    max={20}
                    value={numBehavioralQuestions}
                    onChange={(e) => setNumBehavioralQuestions(Math.min(20, Math.max(1, parseInt(e.target.value) || 5)))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Questions
                  </>
                )}
              </button>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Questions are generated based on your resume data. Make sure your resume is complete in the Resume Builder for best results.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            {!questions && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <Brain className="text-gray-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Prepare for Your Interview?
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Enter a job description (optional) and select the number of questions you'd like to practice. 
                  We'll generate personalized technical and behavioral questions based on your resume.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <Code className="text-blue-600 mb-3 mx-auto" size={32} />
                    <h4 className="font-semibold text-gray-900 mb-2">Technical Questions</h4>
                    <p className="text-sm text-gray-600">Based on your skills, technologies, and experience</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <Users className="text-purple-600 mb-3 mx-auto" size={32} />
                    <h4 className="font-semibold text-gray-900 mb-2">Behavioral Questions</h4>
                    <p className="text-sm text-gray-600">STAR-method questions based on your experience</p>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Questions...</h3>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
            )}

            {questions && (
              <div className="space-y-8">
                {/* Technical Questions */}
                {questions.technical_questions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Code className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Technical Questions</h2>
                        <p className="text-sm text-gray-600">{questions.technical_questions.length} questions generated</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {questions.technical_questions.map((q, index) => renderQuestion(q, index, 'technical'))}
                    </div>
                  </div>
                )}

                {/* Behavioral Questions */}
                {questions.behavioral_questions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Behavioral Questions</h2>
                        <p className="text-sm text-gray-600">{questions.behavioral_questions.length} questions generated</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {questions.behavioral_questions.map((q, index) => renderQuestion(q, index, 'behavioral'))}
                    </div>
                  </div>
                )}

                {questions.technical_questions.length === 0 && questions.behavioral_questions.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <AlertCircle className="text-yellow-600 mx-auto mb-2" size={32} />
                    <h3 className="font-semibold text-gray-900 mb-1">No Questions Generated</h3>
                    <p className="text-sm text-gray-600">Please try again with more resume information or a different job description.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}