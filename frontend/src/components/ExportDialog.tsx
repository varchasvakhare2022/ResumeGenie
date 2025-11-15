import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { useResumeStore } from '../store/useResumeStore'
import { exportToPDF, type ExportOptions } from '../hooks/useExport'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  contentRef: React.RefObject<HTMLDivElement>
}

export default function ExportDialog({ isOpen, onClose, contentRef }: ExportDialogProps) {
  const { resume } = useResumeStore()
  const [includeLinks, setIncludeLinks] = useState(true)
  const [exporting, setExporting] = useState(false)

  if (!isOpen) return null

  // Generate filename from resume name or default
  const generateFilename = () => {
    if (resume.personal.firstName || resume.personal.lastName) {
      const firstName = resume.personal.firstName || ''
      const lastName = resume.personal.lastName || ''
      const name = `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, '-')
      return `${name}-resume.pdf`
    }
    return 'resumegenie-resume.pdf'
  }

  const filename = generateFilename()

  const handleExport = async () => {
    if (!contentRef.current) {
      alert('Content not found. Please try again.')
      return
    }

    setExporting(true)
    try {
      const options: ExportOptions = {
        paperSize: 'A4', // Fixed A4
        marginSize: 'resume', // Fixed resume margins (0.75" top/bottom, 0.6" left/right)
        includeLinks,
      }

      await exportToPDF(contentRef.current, {
        ...options,
        filename,
      })
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Export as PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={exporting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export Settings Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">PDF Settings</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div><strong>Paper Size:</strong> A4 (210 × 297 mm)</div>
              <div><strong>Margins:</strong> 0.75" top/bottom, 0.6" left/right</div>
              <div className="text-blue-600 mt-2">Optimized for ATS-friendly resume format</div>
            </div>
          </div>

          {/* Include Links */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeLinks"
              checked={includeLinks}
              onChange={(e) => setIncludeLinks(e.target.checked)}
              className="text-brand-primary"
              disabled={exporting}
            />
            <label htmlFor="includeLinks" className="text-sm text-gray-700 cursor-pointer">
              Include clickable links
            </label>
          </div>

          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={exporting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || !contentRef.current}
            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {exporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting PDF...
              </>
            ) : (
              <>
                <FileText size={18} />
                Export as PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

