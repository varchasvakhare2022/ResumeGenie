import { FileText, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ATSChecker() {
  const { themeConfig } = useTheme()
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Theme-aware */}
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

        {/* Placeholder Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <AlertCircle size={20} />
              <span className="font-medium">Feature Coming Soon</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upload Your Resume & Job Description
            </h2>
            <p className="text-gray-600">
              This feature will analyze your resume's compatibility with job descriptions,
              provide keyword matching scores, and suggest improvements to increase your
              chances of passing ATS filters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <FileText className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-sm text-gray-600">Paste or upload your resume</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <CheckCircle2 className="text-green-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Paste Job Description</h3>
                <p className="text-sm text-gray-600">Add the job posting details</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <TrendingUp className="text-purple-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Get Your Score</h3>
                <p className="text-sm text-gray-600">Receive detailed analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

