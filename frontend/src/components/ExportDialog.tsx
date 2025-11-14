import { useState } from 'react'
import { X, Download, Printer, FileText } from 'lucide-react'
import { useResumeStore } from '../store/useResumeStore'
import { exportToPrint, exportToPDF, type ExportOptions } from '../hooks/useExport'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  contentRef: React.RefObject<HTMLDivElement>
}

type PaperSize = 'A4' | 'Letter'
type MarginSize = 'small' | 'medium' | 'large'

export default function ExportDialog({ isOpen, onClose, contentRef }: ExportDialogProps) {
  const { resume } = useResumeStore()
  const [paperSize, setPaperSize] = useState<PaperSize>('A4')
  const [marginSize, setMarginSize] = useState<MarginSize>('medium')
  const [includeLinks, setIncludeLinks] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [exportMethod, setExportMethod] = useState<'print' | 'pdf'>('print')

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
        paperSize,
        marginSize,
        includeLinks,
      }

      if (exportMethod === 'print') {
        await exportToPrint(contentRef.current, options)
      } else {
        await exportToPDF(contentRef.current, {
          ...options,
          filename,
        })
      }
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
            <Download className="text-brand-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Export Resume</h2>
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
          {/* Export Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportMethod"
                  value="print"
                  checked={exportMethod === 'print'}
                  onChange={(e) => setExportMethod(e.target.value as 'print')}
                  className="text-brand-primary"
                  disabled={exporting}
                />
                <Printer size={18} />
                <span className="text-sm">Print (Primary)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="exportMethod"
                  value="pdf"
                  checked={exportMethod === 'pdf'}
                  onChange={(e) => setExportMethod(e.target.value as 'pdf')}
                  className="text-brand-primary"
                  disabled={exporting}
                />
                <FileText size={18} />
                <span className="text-sm">PDF (Fallback)</span>
              </label>
            </div>
          </div>

          {/* Paper Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paper Size
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={exporting}
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
            </select>
          </div>

          {/* Margin Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margins
            </label>
            <select
              value={marginSize}
              onChange={(e) => setMarginSize(e.target.value as MarginSize)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={exporting}
            >
              <option value="small">Small (0.5 in)</option>
              <option value="medium">Medium (1 in)</option>
              <option value="large">Large (1.5 in)</option>
            </select>
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

          {/* Filename (for PDF) */}
          {exportMethod === 'pdf' && (
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
          )}
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
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} />
                Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

