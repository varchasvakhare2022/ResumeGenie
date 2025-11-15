import { useState } from 'react'
import { Download } from 'lucide-react'
import ExportDialog from './ExportDialog'

interface ExportButtonProps {
  className?: string
  contentRef: React.RefObject<HTMLDivElement>
}

export default function ExportButton({ className = '', contentRef }: ExportButtonProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsExportDialogOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600 transition-colors ${className}`}
      >
        <Download size={18} />
        Export as PDF
      </button>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        contentRef={contentRef}
      />
    </>
  )
}

