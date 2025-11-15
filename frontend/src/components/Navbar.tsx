import { Link, useLocation } from 'react-router-dom'
import { FileText, CheckCircle2, Mail, MessageSquare, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/builder', label: 'Resume Builder', icon: FileText },
    { path: '/ats-checker', label: 'ATS Checker', icon: CheckCircle2 },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail },
    { path: '/interview-questions', label: 'Interview Prep', icon: MessageSquare },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary rounded-lg transform rotate-6 group-hover:rotate-12 transition-transform"></div>
              <div className="relative bg-gradient-to-br from-brand-primary to-brand-secondary text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                RG
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent hidden sm:block">
              ResumeGenie
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${active
                      ? 'text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md'
                      : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon size={18} />}
                    <span>{link.label}</span>
                  </div>
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${active
                      ? 'text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-md'
                      : 'text-gray-700 hover:text-brand-primary hover:bg-gray-50'
                    }
                  `}
                >
                  {Icon && <Icon size={20} />}
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}

