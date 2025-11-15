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
      : 'w-full p-8 print:p-0'

    return (
      <div 
        ref={ref} 
        className={`${printClasses} ${className} resume-container`}
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
          fontFamily: 'Inter, Roboto, Lato, Calibri, Helvetica, sans-serif',
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text',
          msUserSelect: 'text'
        }}
      >
        <div className="resume-content" style={{ padding: '0', margin: '0', userSelect: 'text', WebkitUserSelect: 'text' }}>
          {children}
        </div>
      </div>
    )
  }
)

TemplateFrame.displayName = 'TemplateFrame'

export default TemplateFrame

