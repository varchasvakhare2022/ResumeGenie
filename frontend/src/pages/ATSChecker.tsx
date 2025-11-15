import { useState, useRef } from 'react'
import { FileText, CheckCircle2, AlertCircle, TrendingUp, Upload, X, Loader2, Target, Lightbulb, BarChart3 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { atsScoreFromFile, type ATSResponse } from '../lib/api'

export default function ATSChecker() {
  const { themeConfig } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [resumeFileName, setResumeFileName] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<ATSResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate hire meter based on ATS score
  const calculateHireProbability = (atsScore: number): { percentage: number; label: string; color: string } => {
    if (atsScore >= 85) {
      return { percentage: 90, label: 'Excellent Match', color: 'bg-green-500' }
    } else if (atsScore >= 75) {
      return { percentage: 75, label: 'Strong Candidate', color: 'bg-green-400' }
    } else if (atsScore >= 65) {
      return { percentage: 60, label: 'Good Fit', color: 'bg-yellow-500' }
    } else if (atsScore >= 50) {
      return { percentage: 45, label: 'Fair Match', color: 'bg-yellow-400' }
    } else {
      return { percentage: 30, label: 'Needs Improvement', color: 'bg-red-400' }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
    const validExtensions = ['pdf', 'doc', 'docx']
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setResumeFileName(file.name)
    setUploadedFile(file)
    setError(null)
    setScore(null)
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) {
      setError('Please upload a resume file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await atsScoreFromFile(uploadedFile, jobDescription || undefined)
      setScore(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume')
      console.error('ATS analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const hireMeter = score ? calculateHireProbability(score.score) : null

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
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ATS Score Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze your resume against job descriptions to improve your ATS compatibility score.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Input */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-brand-primary" size={24} />
                Upload Your Resume
              </h2>

              {/* File Upload */}
              <div className="mb-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {resumeFileName ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="text-brand-primary" size={32} />
                      <div>
                        <p className="font-medium text-gray-900">{resumeFileName}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setResumeFileName(null)
                            setUploadedFile(null)
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-600 font-medium">Click to upload resume</p>
                      <p className="text-sm text-gray-500 mt-1">PDF or DOCX (max 5MB)</p>
                    </div>
                  )}
                </div>
                {uploadedFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Note: For best results, ensure your uploaded file has selectable text (not scanned images).
                  </p>
                )}
              </div>

              {/* Job Description Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                  placeholder="Paste the job description here for targeted ATS analysis. If left empty, we'll analyze your resume's general ATS compatibility."
                />
                <p className="text-xs text-gray-500 mt-2">
                  {jobDescription.trim() 
                    ? 'Job description will be used for keyword matching and relevance scoring.' 
                    : 'Without a job description, you\'ll get a general ATS compatibility score.'}
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !uploadedFile}
                className="w-full mt-6 px-6 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    Analyze Resume
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            {score && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="text-brand-primary" size={24} />
                  Analysis Results
                </h2>

                {/* ATS Score */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-brand-primary">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-800">ATS Score</span>
                    <span className={`text-5xl font-bold ${
                      score.score >= 80 ? 'text-green-600' :
                      score.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.score}%
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-4 shadow-inner mb-2">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        score.score >= 80 ? 'bg-green-500' :
                        score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {score.score >= 80 ? 'Excellent! Your resume has a strong ATS compatibility score.' :
                     score.score >= 60 ? 'Good! Your resume is ATS-friendly, but there\'s room for improvement.' :
                     'Your resume needs improvement to pass ATS filters effectively.'}
                  </p>
                </div>

                {/* Hire Meter */}
                {hireMeter && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <TrendingUp className="text-purple-600" size={20} />
                          Hire Probability
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{hireMeter.label}</p>
                      </div>
                      <span className="text-4xl font-bold text-purple-600">
                        {hireMeter.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white rounded-full h-6 shadow-inner">
                      <div
                        className={`h-6 rounded-full transition-all duration-500 ${hireMeter.color}`}
                        style={{ width: `${hireMeter.percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Based on your ATS score, you have a {hireMeter.percentage}% chance of passing the initial screening and getting selected for an interview.
                    </p>
                  </div>
                )}

                {/* Score Breakdown */}
                {score.breakdown && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Score Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Keywords</span>
                          <span className="font-semibold">{score.breakdown.keywords}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${score.breakdown.keywords}%` }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Action Verbs</span>
                          <span className="font-semibold">{score.breakdown.verbs}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${score.breakdown.verbs}%` }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Metrics</span>
                          <span className="font-semibold">{score.breakdown.metrics}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${score.breakdown.metrics}%` }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Sections</span>
                          <span className="font-semibold">{score.breakdown.sections}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${score.breakdown.sections}%` }} />
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Experience</span>
                          <span className="font-semibold">{score.breakdown.experience}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${score.breakdown.experience}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Improvement Tips */}
                {score.tips && score.tips.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800 flex items-center gap-2">
                      <Lightbulb className="text-green-600" size={20} />
                      Improvement Suggestions
                    </h3>
                    <ul className="space-y-3">
                      {score.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                          <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={18} />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">How It Works</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upload Resume</p>
                    <p className="text-sm text-gray-600 mt-1">Upload your resume file (PDF or DOCX)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Add Job Description</p>
                    <p className="text-sm text-gray-600 mt-1">Optionally paste the job description for targeted analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get Analysis</p>
                    <p className="text-sm text-gray-600 mt-1">Receive detailed ATS score, hire probability, and improvement tips</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">What We Analyze</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Keyword matching with job description</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Action verb usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Quantitative metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Required sections presence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-blue-600 mt-0.5" size={16} />
                  <span>Experience quality</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
