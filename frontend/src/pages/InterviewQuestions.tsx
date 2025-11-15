import { MessageSquare, Brain, Target, Lightbulb } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function InterviewQuestions() {
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
            <MessageSquare className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Interview Question Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prepare for interviews with AI-generated questions based on your resume and job description.
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
              <Brain size={20} />
              <span className="font-medium">Feature Coming Soon</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Master Your Interview Preparation
            </h2>
            <p className="text-gray-600">
              This feature will generate practice interview questions tailored to your background
              and the specific role you're applying for. Practice behavioral, technical, and
              role-specific questions to build confidence.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <Target className="text-blue-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Select Question Types</h3>
                <p className="text-sm text-gray-600">Behavioral, technical, role-specific</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
                <Brain className="text-orange-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">AI-Generated Questions</h3>
                <p className="text-sm text-gray-600">Based on your resume and job</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <Lightbulb className="text-purple-600 mb-3" size={32} />
                <h3 className="font-semibold text-gray-900 mb-2">Answer Suggestions</h3>
                <p className="text-sm text-gray-600">Get guidance on key points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

