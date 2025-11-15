import { Link } from 'react-router-dom'
import { FileText, CheckCircle2, Mail, MessageSquare, Sparkles, ArrowRight, Zap, Shield, Target, Brain, Laugh } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Home() {
  const { themeConfig } = useTheme()
  const features = [
    {
      id: 'builder',
      title: 'Resume Builder',
      description: 'Create professional, ATS-friendly resumes with our intuitive step-by-step builder. Choose from multiple templates and export in PDF format.',
      icon: FileText,
      path: '/builder',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Multiple Templates', 'ATS-Optimized', 'Real-time Preview', 'PDF Export'],
    },
    {
      id: 'ats',
      title: 'ATS Score Checker',
      description: 'Analyze your resume against job descriptions to improve your ATS compatibility score and increase your chances of getting noticed.',
      icon: CheckCircle2,
      path: '/ats-checker',
      gradient: 'from-green-500 to-emerald-500',
      features: ['Job Description Matching', 'Keyword Analysis', 'Score Breakdown', 'Improvement Tips'],
    },
    {
      id: 'cover-letter',
      title: 'AI-Generated Cover Letter',
      description: 'Generate personalized cover letters tailored to specific job postings using AI. Save time while maintaining authenticity.',
      icon: Mail,
      path: '/cover-letter',
      gradient: 'from-purple-500 to-pink-500',
      features: ['AI-Powered Generation', 'Job-Specific Tailoring', 'Multiple Variations', 'Customizable Tone'],
    },
    {
      id: 'interview',
      title: 'Interview Question Generator',
      description: 'Prepare for interviews with AI-generated questions based on your resume and job description. Practice and build confidence.',
      icon: MessageSquare,
      path: '/interview-questions',
      gradient: 'from-orange-500 to-red-500',
      features: ['Role-Specific Questions', 'Behavioral Questions', 'Technical Questions', 'Answer Suggestions'],
    },
    {
      id: 'roaster',
      title: 'Resume Roaster',
      description: 'Upload your resume and get brutally honest (but helpful) AI feedback wrapped in humor. Learn while you laugh!',
      icon: Laugh,
      path: '/resume-roaster',
      gradient: 'from-orange-600 to-red-600',
      features: ['Funny Feedback', 'AI-Powered Analysis', 'Real Insights', 'Actionable Tips'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section - Theme-aware */}
      <section 
        className="relative overflow-hidden text-white py-20 md:py-32 transition-all duration-500"
        style={{
          background: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent})`
        }}
      >
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="animate-pulse" size={20} />
              <span className="text-sm font-medium">Powered by AI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Your Career,
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Elevated
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Build winning resumes, ace ATS checks, craft perfect cover letters, and prepare for interviews—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/builder"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/ats-checker"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Check ATS Score
                <Zap size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"> Land Your Dream Job</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools powered by AI to help you stand out in today's competitive job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.id}
                to={feature.path}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={32} />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-brand-primary font-semibold group-hover:gap-4 transition-all">
                    <span>Try it now</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
              <div className="text-blue-100">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
              <div className="text-blue-100">ATS Pass Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Cover Letters</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">ResumeGenie</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: 'AI-Powered',
              description: 'Leverage cutting-edge AI to generate professional content tailored to your industry and role.',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Shield,
              title: 'ATS-Optimized',
              description: 'Every resume is optimized for Applicant Tracking Systems to ensure maximum visibility.',
              color: 'from-green-500 to-emerald-500',
            },
            {
              icon: Target,
              title: 'Job-Specific',
              description: 'Tailor every document to match specific job descriptions and requirements perfectly.',
              color: 'from-blue-500 to-cyan-500',
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="text-center p-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                  <Icon size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start building your professional resume today and take the first step towards your career goals.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-4 rounded-lg font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            Start Building Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}

