import { toPng, toJpeg } from 'html-to-image'
import jsPDF from 'jspdf'

export interface ExportOptions {
  paperSize: 'A4' | 'Letter'
  marginSize: 'small' | 'medium' | 'large'
  includeLinks: boolean
  filename?: string
}

const PAPER_SIZES = {
  A4: { width: 210, height: 297 }, // mm
  Letter: { width: 215.9, height: 279.4 }, // mm
}

const MARGIN_SIZES = {
  small: 12.7, // 0.5 inch in mm
  medium: 25.4, // 1 inch in mm
  large: 38.1, // 1.5 inch in mm
}

export async function exportToPrint(
  content: HTMLDivElement,
  options: ExportOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a clone of the content for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        reject(new Error('Failed to open print window. Please allow pop-ups.'))
        return
      }

      // Get all stylesheets
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            if (sheet.href) {
              return `<link rel="stylesheet" href="${sheet.href}">`
            }
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n')
          } catch (e) {
            return ''
          }
        })
        .join('\n')

      // Clone content
      const clonedContent = content.cloneNode(true) as HTMLDivElement

      // Remove non-printable elements
      const noPrintElements = clonedContent.querySelectorAll('.no-print, button, .export-button, .ai-assist-button')
      noPrintElements.forEach((el) => el.remove())

      // Apply print styles
      const printStyles = `
        <style>
          @page {
            size: ${options.paperSize};
            margin: ${MARGIN_SIZES[options.marginSize]}mm;
          }
          @media print {
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .no-print,
            button,
            .export-button,
            .ai-assist-button {
              display: none !important;
            }
            a {
              ${options.includeLinks ? 'color: blue; text-decoration: underline;' : 'color: inherit; text-decoration: none;'}
            }
            .resume-container {
              width: 100%;
              max-width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }
            .resume-section {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid;
              page-break-inside: avoid;
            }
          }
        </style>
      `

      // Write to print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume - Print</title>
            <meta charset="utf-8">
            ${styles}
            ${printStyles}
          </head>
          <body>
            ${clonedContent.outerHTML}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 250);
              };
            </script>
          </body>
        </html>
      `)

      printWindow.document.close()

      // Handle print dialog close
      const checkClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkClosed)
          resolve()
        }
      }, 100)

      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkClosed)
        if (!printWindow.closed) {
          printWindow.close()
        }
        resolve()
      }, 30000)
    } catch (error) {
      reject(error)
    }
  })
}

export async function exportToPDF(
  content: HTMLDivElement,
  options: ExportOptions
): Promise<void> {
  try {
    // Get paper dimensions
    const paperWidth = PAPER_SIZES[options.paperSize].width
    const paperHeight = PAPER_SIZES[options.paperSize].height
    const margin = MARGIN_SIZES[options.marginSize]
    const contentWidth = paperWidth - margin * 2
    const contentHeight = paperHeight - margin * 2

    // Clone content for export
    const clonedContent = content.cloneNode(true) as HTMLDivElement

    // Remove non-printable elements
    const noPrintElements = clonedContent.querySelectorAll('.no-print, button, .export-button, .ai-assist-button')
    noPrintElements.forEach((el) => el.remove())

    // Hide links if not included
    if (!options.includeLinks) {
      const links = clonedContent.querySelectorAll('a')
      links.forEach((link) => {
        link.style.color = 'inherit'
        link.style.textDecoration = 'none'
      })
    }

    // Configure html-to-image options
    const imageOptions = {
      backgroundColor: '#ffffff',
      width: content.offsetWidth,
      height: content.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
      pixelRatio: 2, // Higher quality
      quality: 1.0,
      useCORS: true,
      allowTaint: true,
    }

    // Convert to image (try PNG first, fallback to JPEG)
    let dataUrl: string
    try {
      dataUrl = await toPng(clonedContent, imageOptions)
    } catch (error) {
      console.warn('PNG conversion failed, trying JPEG:', error)
      try {
        dataUrl = await toJpeg(clonedContent, imageOptions)
      } catch (jpegError) {
        throw new Error(`Image conversion failed: ${jpegError instanceof Error ? jpegError.message : 'Unknown error'}`)
      }
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: paperHeight > paperWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [paperWidth, paperHeight],
    })

    // Calculate image dimensions to fit page
    const img = new Image()
    img.src = dataUrl

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        try {
          const imgWidth = img.width
          const imgHeight = img.height
          const imgAspectRatio = imgWidth / imgHeight
          const contentAspectRatio = contentWidth / contentHeight

          let finalWidth: number
          let finalHeight: number

          if (imgAspectRatio > contentAspectRatio) {
            // Image is wider, fit to width
            finalWidth = contentWidth
            finalHeight = contentWidth / imgAspectRatio
          } else {
            // Image is taller, fit to height
            finalHeight = contentHeight
            finalWidth = contentHeight * imgAspectRatio
          }

          // Center image on page if smaller than content area
          const x = margin + (contentWidth - finalWidth) / 2
          const y = margin + (contentHeight - finalHeight) / 2

          // Determine image format
          const imageFormat = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
          
          // Add image to PDF
          pdf.addImage(dataUrl, imageFormat, x, y, finalWidth, finalHeight)

          // Save PDF
          pdf.save(options.filename || 'resume.pdf')
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
    })
  } catch (error) {
    throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

