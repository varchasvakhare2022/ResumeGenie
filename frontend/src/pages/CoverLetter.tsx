import { Mail, Sparkles, FileText, Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function CoverLetter() {
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
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI-Generated Cover Letter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate personalized cover letters tailored to specific job postings using AI.
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg">
              <Sparkles size={20} />
              <span className="font-medium">Feature Coming Soon</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create Your Perfect Cover Letter
            </h2>
            <p className="text-gray-600">
              This feature will generate professional, personalized cover letters that match
              your resume and the job description. AI-powered content ensures authenticity
              while saving you time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <FileText className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Enter Job Details</h3>
                <p className="text-sm text-gray-600">Company name and role</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <Sparkles className="text-purple-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">AI Generation</h3>
                <p className="text-sm text-gray-600">Generate personalized content</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <Zap className="text-green-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Customize & Export</h3>
                <p className="text-sm text-gray-600">Edit and download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

