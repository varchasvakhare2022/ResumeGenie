import html2pdf from 'html2pdf.js'

export interface ExportOptions {
  paperSize: 'A4' | 'Letter'
  marginSize: 'small' | 'medium' | 'large' | 'resume' // 'resume' = fixed resume margins
  includeLinks: boolean
  filename?: string
}

const PAPER_SIZES = {
  A4: { width: 210, height: 297 }, // mm (8.27 × 11.69 in)
  Letter: { width: 215.9, height: 279.4 }, // mm
}

const MARGIN_SIZES = {
  small: 12.7, // 0.5 inch in mm
  medium: 25.4, // 1 inch in mm
  large: 38.1, // 1.5 inch in mm
}

// Fixed resume margins: 0.75" top/bottom (19mm), 0.6" left/right (15.24mm)
const RESUME_MARGINS = {
  top: 19.05, // 0.75 inch in mm
  bottom: 19.05, // 0.75 inch in mm
  left: 15.24, // 0.6 inch in mm
  right: 15.24, // 0.6 inch in mm
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

      // Apply print styles with fixed resume margins if specified
      const marginValue = options.marginSize === 'resume'
        ? `${RESUME_MARGINS.top}mm ${RESUME_MARGINS.right}mm ${RESUME_MARGINS.bottom}mm ${RESUME_MARGINS.left}mm`
        : `${MARGIN_SIZES[options.marginSize]}mm`
      
      const printStyles = `
        <style>
          @page {
            size: A4;
            margin: ${marginValue};
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
    // Wait for fonts to load
    await document.fonts.ready
    await new Promise(resolve => setTimeout(resolve, 200))

    // Verify content is visible and has dimensions
    const originalRect = content.getBoundingClientRect()
    const originalWidth = originalRect.width || content.scrollWidth || content.offsetWidth
    const originalHeight = originalRect.height || content.scrollHeight || content.offsetHeight

    if (originalWidth === 0 || originalHeight === 0) {
      throw new Error(`Content has zero dimensions (${originalWidth}x${originalHeight}). Please ensure the preview is visible.`)
    }

    // Store original styles to restore later
    const originalStyles = {
      display: content.style.display,
      visibility: content.style.visibility,
      position: content.style.position,
      overflow: content.style.overflow,
      transform: content.style.transform,
    }

    // Ensure content is visible and properly positioned for capture
    content.style.display = 'block'
    content.style.visibility = 'visible'
    content.style.position = 'relative'
    content.style.overflow = 'visible'
    content.style.transform = 'none'

    // Hide non-printable elements temporarily
    const noPrintElements = content.querySelectorAll('.no-print, button, .export-button, .ai-assist-button')
    const hiddenElements: { el: HTMLElement; display: string }[] = []
    noPrintElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      hiddenElements.push({ el: htmlEl, display: htmlEl.style.display })
      htmlEl.style.display = 'none'
    })

    // Handle links styling
    const links = content.querySelectorAll('a')
    const linkStyles: { el: HTMLElement; originalColor: string; originalDecoration: string }[] = []
    links.forEach((link) => {
      const htmlLink = link as HTMLElement
      linkStyles.push({
        el: htmlLink,
        originalColor: htmlLink.style.color,
        originalDecoration: htmlLink.style.textDecoration
      })
      
      if (!options.includeLinks) {
        htmlLink.style.color = 'inherit'
        htmlLink.style.textDecoration = 'none'
      } else {
        htmlLink.style.color = '#0000EE'
        htmlLink.style.textDecoration = 'underline'
      }
    })

    // Get margins
    const marginTopMm = RESUME_MARGINS.top
    const marginBottomMm = RESUME_MARGINS.bottom
    const marginLeftMm = RESUME_MARGINS.left
    const marginRightMm = RESUME_MARGINS.right

    // Scroll to top to ensure content is in view
    content.scrollIntoView({ behavior: 'instant', block: 'start' })
    
    // Wait for scroll and rendering
    await new Promise(resolve => setTimeout(resolve, 300))

    // Configure html2pdf with simpler, more reliable options
    const opt = {
      margin: [marginTopMm, marginRightMm, marginBottomMm, marginLeftMm],
      filename: options.filename || 'resume.pdf',
      image: { 
        type: 'png', 
        quality: 1.0 
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: true, // Enable logging to debug
        backgroundColor: '#ffffff',
        width: originalWidth,
        height: originalHeight,
        windowWidth: originalWidth,
        windowHeight: originalHeight,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
      },
    }

    // Wait for final rendering
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate PDF with error handling
    try {
      await html2pdf().set(opt).from(content).save()
      console.log('PDF generated successfully')
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError)
      throw pdfError
    }

    // Restore original styles
    content.style.display = originalStyles.display
    content.style.visibility = originalStyles.visibility
    content.style.position = originalStyles.position
    content.style.overflow = originalStyles.overflow
    content.style.transform = originalStyles.transform

    // Restore hidden elements
    hiddenElements.forEach(({ el, display }) => {
      el.style.display = display
    })

    // Restore link styles
    linkStyles.forEach(({ el, originalColor, originalDecoration }) => {
      el.style.color = originalColor
      el.style.textDecoration = originalDecoration
    })

  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

