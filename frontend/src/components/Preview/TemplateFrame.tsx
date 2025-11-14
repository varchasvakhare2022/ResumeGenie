import { ReactNode, forwardRef } from 'react'

interface TemplateFrameProps {
  children: ReactNode
  className?: string
  forPrint?: boolean
  paperSize?: 'A4' | 'Letter'
  marginSize?: 'small' | 'medium' | 'large'
}

const TemplateFrame = forwardRef<HTMLDivElement, TemplateFrameProps>(
  ({ children, className = '', forPrint = false, paperSize = 'A4', marginSize = 'medium' }, ref) => {
    // Print styles
    const printClasses = forPrint
      ? `resume-print-preview ${paperSize.toLowerCase()} margin-${marginSize}`
      : 'bg-white shadow-lg rounded-lg p-8'

    return (
      <div ref={ref} className={`${printClasses} ${className} resume-container`}>
        <div className="resume-content space-y-6 resume-section">
          {children}
        </div>
      </div>
    )
  }
)

TemplateFrame.displayName = 'TemplateFrame'

export default TemplateFrame

