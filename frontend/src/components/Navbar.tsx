import { Link, useLocation } from 'react-router-dom'
import { FileText, CheckCircle2, Mail, MessageSquare, Menu, X, Home as HomeIcon, Laugh } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { themeConfig } = useTheme()

  const navLinks = [
    { path: '/builder', label: 'Resume Builder', icon: FileText, shortLabel: 'Builder' },
    { path: '/ats-checker', label: 'ATS Checker', icon: CheckCircle2, shortLabel: 'ATS' },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail, shortLabel: 'Cover' },
    { path: '/interview-questions', label: 'Interview Prep', icon: MessageSquare, shortLabel: 'Interview' },
    { path: '/resume-roaster', label: 'Resume Roaster', icon: Laugh, shortLabel: 'Roaster' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // CRAZY NAVBAR STYLES FOR EACH PAGE
  const renderNavbar = () => {
    switch (themeConfig.navbarStyle) {
      case 'floating': // Home page - Floating glass morphism (KEEP AS IS)
        return (
          <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
            <div 
              className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-full px-6 py-3 shadow-2xl"
              style={{
                boxShadow: `0 8px 32px 0 rgba(${themeConfig.colors.primary.replace('#', '')}, 0.15)`
              }}
            >
              <div className="flex items-center gap-1">
                <Link 
                  to="/" 
                  className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                  style={{ 
                    background: isActive('/') ? `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})` : 'transparent',
                    color: isActive('/') ? 'white' : themeConfig.colors.primary
                  }}
                >
                  <HomeIcon size={20} />
                </Link>
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.path)
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 ${
                        active ? 'text-white' : 'text-gray-700 hover:text-white'
                      }`}
                      style={active ? {
                        background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                        boxShadow: `0 4px 15px rgba(${themeConfig.colors.primary.replace('#', '')}, 0.4)`
                      } : {}}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = themeConfig.colors.primary + '20'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} />
                        <span className="hidden sm:inline">{link.shortLabel}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        )

      case 'sidebar': // Builder - Professional Clean Navigation with Enhanced Design
        return (
          <nav 
            className="sticky top-0 z-50 relative overflow-hidden"
            style={{
              background: `linear-gradient(to bottom, ${themeConfig.colors.light}, white)`,
              borderBottom: `2px solid ${themeConfig.colors.primary}15`,
              boxShadow: `0 2px 10px rgba(0,0,0,0.05)`
            }}
          >
            {/* Subtle top accent line */}
            <div 
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent})`
              }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-20">
                {/* Enhanced Logo Section */}
                <Link 
                  to="/" 
                  className="flex items-center gap-3 group mr-10"
                  style={{ color: themeConfig.colors.primary }}
                >
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${themeConfig.colors.primary}, transparent)`,
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      transform: 'translate(-10px, -10px)'
                    }}
                  ></div>
                  
                  <div 
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                      boxShadow: `0 6px 20px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.25)`
                    }}
                  >
                    <div className="absolute inset-0 rounded-xl opacity-20 bg-white animate-pulse"></div>
                    <span className="relative z-10">RG</span>
                  </div>
                  <div className="hidden md:block">
                    <span className="text-xl font-bold block">ResumeGenie</span>
                    <span 
                      className="text-xs font-medium uppercase tracking-wider opacity-70"
                      style={{ color: themeConfig.colors.primary }}
                    >
                      Resume Builder
                    </span>
                  </div>
                </Link>

                {/* Enhanced Horizontal Navigation with Better Design */}
                <div className="flex-1 flex items-center gap-2 relative">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    const isLast = index === navLinks.length - 1
                    
                    return (
                      <div key={link.path} className="relative flex items-center">
                        <Link
                          to={link.path}
                          className={`
                            relative flex flex-col items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl transition-all duration-300
                            ${active ? 'scale-105' : 'hover:scale-102'}
                          `}
                          style={active ? {
                            background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                            color: 'white',
                            boxShadow: `0 6px 20px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.3),
                                        inset 0 1px 0 rgba(255,255,255,0.2)`,
                            transform: 'translateY(-2px)'
                          } : {
                            color: '#64748b',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.color = themeConfig.colors.primary
                              e.currentTarget.style.backgroundColor = themeConfig.colors.primary + '0D'
                              e.currentTarget.style.transform = 'translateY(-1px)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.color = '#64748b'
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.transform = 'translateY(0)'
                            }
                          }}
                        >
                          {/* Icon with subtle animation */}
                          <div className="relative">
                            <Icon size={22} className={active ? 'animate-pulse' : ''} strokeWidth={active ? 2.5 : 2} />
                            {active && (
                              <div 
                                className="absolute inset-0 rounded-full blur-md opacity-30"
                                style={{ backgroundColor: 'white' }}
                              ></div>
                            )}
                          </div>
                          <span className="text-xs font-semibold hidden sm:block tracking-wide">{link.shortLabel}</span>
                          
                          {/* Enhanced active indicator */}
                          {active && (
                            <>
                              <div 
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-lg"
                                style={{ 
                                  backgroundColor: themeConfig.colors.accent,
                                  boxShadow: `0 0 8px ${themeConfig.colors.accent}`
                                }}
                              ></div>
                              {/* Subtle underline effect */}
                              <div 
                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full"
                                style={{ 
                                  background: `linear-gradient(90deg, transparent, ${themeConfig.colors.accent}, transparent)`,
                                  opacity: 0.6
                                }}
                              ></div>
                            </>
                          )}
                        </Link>
                        
                        {/* Enhanced connecting line */}
                        {!isLast && (
                          <div 
                            className={`w-6 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                              active ? 'opacity-100' : 'opacity-10'
                            }`}
                            style={{ 
                              background: `linear-gradient(90deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                              transform: active ? 'scaleX(1.2)' : 'scaleX(1)'
                            }}
                          ></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </nav>
        )

      case 'circular': // ATS - Floating Action Circle with Radial Menu
        return (
          <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                {/* Logo with Circular Badge */}
                <Link 
                  to="/" 
                  className="flex items-center gap-3 group relative"
                  style={{ color: themeConfig.colors.primary }}
                >
                  <div className="relative">
                    {/* Outer rotating ring (only on hover) */}
                    <div 
                      className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `conic-gradient(from 0deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`,
                        animation: 'spin 3s linear infinite'
                      }}
                    ></div>
                    
                    {/* Main logo circle */}
                    <div 
                      className="relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                        filter: `drop-shadow(0 4px 12px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.3))`
                      }}
                    >
                      RG
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-bold block">ResumeGenie</span>
                    <span 
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: themeConfig.colors.secondary }}
                    >
                      ATS Checker
                    </span>
                  </div>
                </Link>

                {/* Circular Navigation Pills */}
                <div className="flex items-center gap-3">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          relative w-12 h-12 rounded-full flex items-center justify-center
                          transition-all duration-300 ease-out
                          ${active ? 'scale-125 ring-4' : 'hover:scale-110 hover:ring-2'}
                        `}
                        style={active ? {
                          background: `conic-gradient(from ${index * 90}deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`,
                          color: 'white',
                          boxShadow: `0 8px 24px -4px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.4)`,
                          ringColor: themeConfig.colors.accent,
                          ringOpacity: '0.3'
                        } : {
                          backgroundColor: themeConfig.colors.light,
                          color: themeConfig.colors.primary,
                          ringColor: themeConfig.colors.primary,
                          ringOpacity: '0.2'
                        }}
                      >
                        <Icon size={18} className={active ? 'animate-pulse' : ''} />
                        
                        {/* Pulse effect on active */}
                        {active && (
                          <div 
                            className="absolute inset-0 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: themeConfig.colors.accent }}
                          ></div>
                        )}
                        
                        {/* Tooltip label */}
                        <div 
                          className="absolute top-full mt-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block"
                          style={{
                            background: themeConfig.colors.primary,
                            transform: 'translateX(-50%)',
                            left: '50%'
                          }}
                        >
                          {link.shortLabel}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </nav>
        )

      case 'ribbon': // Cover Letter - Elegant Horizontal Ribbon with Wave Effect
        return (
          <nav className="sticky top-0 z-50 relative overflow-hidden">
            {/* Decorative top ribbon wave */}
            <div 
              className="absolute top-0 left-0 right-0 h-2 overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary}, ${themeConfig.colors.accent})`
              }}
            >
              <div className="absolute inset-0" style={{
                background: `repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.2) 20px, rgba(255,255,255,0.2) 40px)`,
                animation: 'slideX 10s linear infinite'
              }}></div>
            </div>
            
            {/* Main navbar */}
            <div 
              className="relative backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.colors.primary}08, ${themeConfig.colors.secondary}05, ${themeConfig.colors.accent}08)`,
                borderBottom: `2px solid ${themeConfig.colors.primary}20`
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                  {/* Elegant Logo */}
                  <Link 
                    to="/" 
                    className="flex items-center gap-4 group relative"
                    style={{ color: themeConfig.colors.primary }}
                  >
                    {/* Glow effect on hover */}
                    <div 
                      className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                      }}
                    ></div>
                    
                    <div 
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-2xl group-hover:shadow-[0_20px_40px_-10px_rgba(168,85,247,0.5)] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                        boxShadow: `0 10px 30px -5px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.3)`
                      }}
                    >
                      RG
                    </div>
                    <div>
                      <span className="text-2xl font-bold block bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
                        ResumeGenie
                      </span>
                      <span 
                        className="text-xs font-light uppercase tracking-[0.15em] opacity-70"
                        style={{ color: themeConfig.colors.secondary }}
                      >
                        Cover Letter Generator
                      </span>
                    </div>
                  </Link>

                  {/* Elegant Ribbon Navigation */}
                  <div className="flex items-center gap-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon
                      const active = isActive(link.path)
                      
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`
                            relative px-5 py-2.5 font-medium text-sm transition-all duration-500
                            ${active ? 'translate-y-[-3px]' : 'hover:translate-y-[-1px]'}
                          `}
                          style={active ? {
                            background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                            clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                            color: 'white',
                            boxShadow: `0 8px 20px -4px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.4)`
                          } : {
                            color: themeConfig.colors.primary + 'CC',
                            clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                            backgroundColor: 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${themeConfig.colors.primary}20, ${themeConfig.colors.secondary}15)`
                              e.currentTarget.style.color = themeConfig.colors.primary
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = 'transparent'
                              e.currentTarget.style.color = themeConfig.colors.primary + 'CC'
                            }
                          }}
                        >
                          {/* Shine effect on active */}
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                          )}
                          <div className="flex items-center gap-2 relative z-10">
                            <Icon size={16} className={active ? 'animate-pulse' : ''} />
                            <span>{link.shortLabel}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )

      case 'playful': // Roaster - Playful Fun Navigation with Character
        return (
          <nav 
            className="sticky top-0 z-50 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
              borderBottom: `4px solid ${themeConfig.colors.accent}`,
              boxShadow: `0 4px 20px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.3)`
            }}
          >
            {/* Animated flame/emoji pattern */}
            <div className="absolute inset-0 opacity-10 overflow-hidden">
              <div 
                className="absolute inset-0 text-6xl font-bold whitespace-nowrap animate-slide-x"
                style={{
                  color: themeConfig.colors.accent,
                  textShadow: '0 0 20px rgba(255,255,255,0.5)'
                }}
              >
                🔥 🔥 🔥 🔥 🔥 🔥 🔥
              </div>
            </div>

            {/* Gradient overlay with sparkles */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${themeConfig.colors.accent}40, transparent 50%),
                             radial-gradient(circle at 80% 50%, ${themeConfig.colors.primary}40, transparent 50%)`,
                animation: 'sparkle 3s ease-in-out infinite alternate'
              }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center justify-between h-24">
                {/* Playful Logo with bounce */}
                <Link 
                  to="/" 
                  className="flex items-center gap-4 group relative transform hover:scale-110 transition-transform duration-300"
                >
                  {/* Glow effect */}
                  <div 
                    className="absolute -inset-3 rounded-3xl opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-500 animate-pulse"
                    style={{
                      background: `radial-gradient(circle, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`
                    }}
                  ></div>
                  
                  <div 
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-2xl border-3 border-white/40 backdrop-blur-sm transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.accent}, ${themeConfig.colors.secondary})`,
                      filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
                      border: '3px solid rgba(255, 255, 255, 0.4)'
                    }}
                  >
                    RG
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white block drop-shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      ResumeGenie
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Resume Roaster</span>
                      <span className="text-xl animate-bounce">🔥</span>
                    </div>
                  </div>
                </Link>

                {/* Playful Navigation Pills */}
                <div className="flex items-center gap-3">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          relative px-5 py-2.5 font-bold text-white uppercase tracking-wide text-xs
                          transition-all duration-300 ease-out
                          ${active ? 'scale-110 animate-bounce-subtle' : 'hover:scale-105 hover:-translate-y-1'}
                        `}
                        style={active ? {
                          background: `linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2))`,
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px 20px 20px 20px',
                          border: '3px solid rgba(255, 255, 255, 0.6)',
                          boxShadow: `0 8px 24px -4px rgba(0,0,0,0.4), 
                                      inset 0 2px 4px rgba(255,255,255,0.3),
                                      0 0 20px ${themeConfig.colors.accent}60`,
                          transform: 'scale(1.1) rotate(-2deg)'
                        } : {
                          borderRadius: '20px 20px 20px 20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(5px)',
                          transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                            e.currentTarget.style.transform = 'scale(1.05) rotate(0deg) translateY(-4px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                            e.currentTarget.style.transform = `scale(1) rotate(${index % 2 === 0 ? 2 : -2}deg) translateY(0)`
                          }
                        }}
                      >
                        {/* Active glow effect */}
                        {active && (
                          <div 
                            className="absolute -inset-2 opacity-50 blur-xl animate-pulse rounded-full"
                            style={{
                              background: `radial-gradient(circle, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`,
                            }}
                          ></div>
                        )}
                        <div className="flex items-center gap-2 relative z-10">
                          <Icon size={16} className={active ? 'animate-spin-slow' : ''} />
                          <span>{link.shortLabel}</span>
                        </div>
                        
                        {/* Active indicator - flame emoji */}
                        {active && (
                          <div 
                            className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce"
                            style={{ filter: 'drop-shadow(0 0 10px rgba(255,193,7,0.8))' }}
                          >
                            🔥
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </nav>
        )

      case 'diagonal': // Interview - Bold Angled Navigation with Energy
        return (
          <nav 
            className="sticky top-0 z-50 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
              clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)'
            }}
          >
            {/* Animated diagonal stripes */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.1) 15px, rgba(255,255,255,0.1) 30px)`,
                  animation: 'slideDiagonal 20s linear infinite'
                }}
              ></div>
            </div>

            {/* Gradient overlay animation */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(45deg, ${themeConfig.colors.primary}, transparent, ${themeConfig.colors.accent}, transparent, ${themeConfig.colors.primary})`,
                backgroundSize: '200% 200%',
                animation: 'gradientMove 8s ease infinite'
              }}
            ></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex items-center justify-between h-28">
                {/* Bold Logo */}
                <Link 
                  to="/" 
                  className="flex items-center gap-4 group relative transform hover:scale-105 transition-transform duration-300"
                >
                  {/* Pulsing glow */}
                  <div 
                    className="absolute -inset-3 rounded-2xl opacity-50 blur-2xl animate-pulse"
                    style={{
                      background: `radial-gradient(circle, rgba(255,255,255,0.4), transparent)`
                    }}
                  ></div>
                  
                  <div 
                    className="relative w-18 h-18 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-2xl border-2 border-white/30 backdrop-blur-sm transform rotate-6 group-hover:rotate-12 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))`,
                      filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
                    }}
                  >
                    RG
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white block drop-shadow-lg">ResumeGenie</span>
                    <span className="text-sm font-bold text-white/90 uppercase tracking-wider">Interview Prep</span>
                  </div>
                </Link>

                {/* Bold Angled Navigation */}
                <div className="flex items-center gap-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon
                    const active = isActive(link.path)
                    const angle = active ? 2 : 1
                    
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          relative px-5 py-3 font-black text-white uppercase tracking-wider text-xs
                          transition-all duration-300 ease-out
                          ${active ? 'scale-110 rotate-2' : 'hover:scale-105 hover:rotate-1'}
                        `}
                        style={active ? {
                          background: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: `0 10px 30px -5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)`,
                          transform: `rotate(${angle}deg) scale(1.1)`
                        } : {
                          clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(5px)',
                          transform: `rotate(${angle}deg)`
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                          }
                        }}
                      >
                        {/* Active glow effect */}
                        {active && (
                          <div 
                            className="absolute -inset-2 opacity-50 blur-lg animate-pulse"
                            style={{
                              background: `linear-gradient(135deg, ${themeConfig.colors.accent}, ${themeConfig.colors.primary})`,
                              clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)'
                            }}
                          ></div>
                        )}
                        <div className="flex items-center gap-2 relative z-10">
                          <Icon size={16} className={active ? 'animate-bounce' : ''} />
                          <span>{link.shortLabel}</span>
                        </div>
                        
                        {/* Active indicator bar */}
                        {active && (
                          <div 
                            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-1.5 rounded-full shadow-lg"
                            style={{ 
                              backgroundColor: themeConfig.colors.accent,
                              boxShadow: `0 0 20px ${themeConfig.colors.accent}`
                            }}
                          ></div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </nav>
        )

      default:
        return null
    }
  }

  // Mobile menu (consistent across all styles)
  const renderMobileMenu = () => {
    if (!isMobileMenuOpen) return null

    return (
      <div 
        className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className="absolute top-0 right-0 h-full w-64 shadow-2xl"
          style={{ backgroundColor: themeConfig.colors.light }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold" style={{ color: themeConfig.colors.primary }}>
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-200"
                style={{ color: themeConfig.colors.primary }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${isActive('/') ? 'text-white shadow-md' : ''}`}
                style={isActive('/') ? {
                  background: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                } : {
                  color: themeConfig.colors.primary
                }}
              >
                <HomeIcon size={20} />
                <span>Home</span>
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${active ? 'text-white shadow-md' : ''}`}
                    style={active ? {
                      background: `linear-gradient(to right, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                    } : {
                      color: themeConfig.colors.primary
                    }}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderNavbar()}
      {renderMobileMenu()}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideX {
          0% { transform: translateX(0); }
          100% { transform: translateX(40px); }
        }
        @keyframes slideDiagonal {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(40px) translateY(40px); }
        }
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide-x {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sparkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.3; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scale(1.1) rotate(-2deg); }
          50% { transform: translateY(-4px) scale(1.15) rotate(-2deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-slide-x {
          animation: slide-x 10s linear infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  )
}
