import { useState } from 'react'
import { Download } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { useResumeStore } from '../store/useResumeStore'

interface ExportButtonProps {
  contentRef: React.RefObject<HTMLDivElement>
  className?: string
}

export default function ExportButton({ contentRef, className = '' }: ExportButtonProps) {
  const { resume } = useResumeStore()
  const [loading, setLoading] = useState(false)

  // Generate filename from resume name
  const generateFilename = () => {
    if (resume.personal.firstName || resume.personal.lastName) {
      const firstName = resume.personal.firstName || ''
      const lastName = resume.personal.lastName || ''
      const name = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-')
      return `${name}-resume.pdf`
    }
    return 'resume.pdf'
  }

  // Configure react-to-print - the hook returns a function to trigger print
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: generateFilename(),
    onBeforeGetContent: () => {
      setLoading(true)
      if (!contentRef.current) {
        console.error('Content ref is null before print')
        alert('Preview not ready. Please wait a moment and try again.')
        setLoading(false)
        return Promise.reject(new Error('Content ref is null'))
      }
      // Verify content exists
      const element = contentRef.current
      if (!element) {
        console.error('Content ref element is null')
        alert('Resume preview not found. Please ensure the preview is visible.')
        setLoading(false)
        return Promise.reject(new Error('Content ref element is null'))
      }
      // Check if it's the container or find it
      const resumeContainer = element.classList.contains('resume-container') 
        ? element 
        : element.querySelector('.resume-container')
      if (!resumeContainer) {
        console.error('Resume container not found in element:', element)
        alert('Resume preview not found. Please ensure the preview is visible.')
        setLoading(false)
        return Promise.reject(new Error('Resume container not found'))
      }
      return Promise.resolve()
    },
    onAfterPrint: () => {
      setLoading(false)
    },
    onPrintError: (error) => {
      console.error('Print error:', error)
      setLoading(false)
      alert('Failed to generate PDF. Please ensure the preview is visible.')
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0.75in 0.6in;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
          background: white;
        }
        .no-print {
          display: none !important;
        }
        button {
          display: none !important;
        }
        a {
          color: #0000EE;
          text-decoration: underline;
        }
        * {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        /* Ensure ModernB template preserves all colors */
        .resume-modern,
        .resume-modern * {
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          background-color: inherit !important;
          color: inherit !important;
        }
        
        /* Preserve dark sidebar background */
        .resume-modern [style*="background-color: #2C2C2C"],
        .resume-modern [style*="background-color:#2C2C2C"],
        .resume-modern [style*="backgroundColor: '#2C2C2C'"],
        .resume-modern [style*="backgroundColor: '#2c2c2c'"],
        .resume-modern [style*="backgroundColor:#2C2C2C"],
        .resume-modern [style*="backgroundColor:#2c2c2c"] {
          background-color: #2C2C2C !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Preserve white text in sidebar */
        .resume-modern [style*="color: #FFFFFF"],
        .resume-modern [style*="color:#FFFFFF"],
        .resume-modern [style*="color: '#FFFFFF'"],
        .resume-modern [style*="color: '#ffffff'"] {
          color: #FFFFFF !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Preserve yellow accent color for progress bars */
        .resume-modern .progress-bar-fill,
        .resume-modern [data-color="#FFD700"],
        .resume-modern [style*="background-color: #FFD700"],
        .resume-modern [style*="background-color:#FFD700"],
        .resume-modern [style*="backgroundColor: '#FFD700'"],
        .resume-modern [style*="backgroundColor: '#FFD700'"],
        .resume-modern [style*="backgroundColor: '#ffd700'"],
        .resume-modern [style*="backgroundColor:#FFD700"] {
          background-color: #FFD700 !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Preserve progress bar track */
        .resume-modern .progress-bar-track {
          background-color: #444444 !important;
          print-color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
    removeAfterPrint: true,
  })

  const handleClick = async () => {
    setLoading(true)
    
    try {
      // Wait a bit to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 200))
      
      console.log('Export button clicked')
      console.log('contentRef.current:', contentRef.current)
      
      // Wait for ref to be attached (max 2 seconds)
      let attempts = 0
      while (!contentRef.current && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      if (!contentRef.current) {
        console.error('Ref is still null after waiting')
        alert('Preview not ready. Please ensure the preview is visible and try again.')
        setLoading(false)
        return
      }
      
      // Debug: Log the element structure
      const element = contentRef.current
      console.log('Ref element:', element)
      console.log('Element tag:', element.tagName)
      console.log('Element classes:', element.className)
      console.log('Has resume-container class:', element.classList?.contains('resume-container'))
      
      // Check if ref is on the resume-container or find it
      let resumeContainer: HTMLElement | null = null
      if (element.classList?.contains('resume-container')) {
        resumeContainer = element as HTMLElement
        console.log('Ref is directly on resume-container')
      } else {
        resumeContainer = element.querySelector?.('.resume-container') as HTMLElement
        console.log('Searching for resume-container inside ref:', resumeContainer)
      }
      
      if (!resumeContainer) {
        console.error('Resume container not found. Element structure:', {
          element,
          className: element.className,
          children: Array.from(element.children || []).map(child => ({
            tag: child.tagName,
            className: child.className
          }))
        })
        alert('Resume preview not found. Please refresh the page and try again.')
        setLoading(false)
        return
      }
      
      console.log('Resume container found, proceeding with print:', resumeContainer)
      
      // Trigger print
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        try {
          handlePrint()
        } catch (error) {
          console.error('Error calling handlePrint:', error)
          alert('Failed to generate PDF. Please try again.')
          setLoading(false)
        }
      }, 100)
    } catch (error) {
      console.error('Error in handleClick:', error)
      alert('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Generating PDF...
        </>
      ) : (
        <>
          <Download size={18} />
          Download as PDF
        </>
      )}
    </button>
  )
}

