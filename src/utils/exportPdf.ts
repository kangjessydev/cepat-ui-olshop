/**
 * exportPdf.ts
 *
 * Lightweight, zero-external-dependency client-side PDF printing and export utility.
 * Creates an isolated printable iframe containing strictly the target HTML with
 * embedded print stylesheets, triggering the system print-to-PDF dialog.
 */

export interface ExportPdfOptions {
  title?: string
  styles?: string
  pageSize?: 'A4' | 'Letter'
  orientation?: 'portrait' | 'landscape'
}

/**
 * Print or Export HTML Element directly to PDF via clean isolated iframe
 */
export function exportToPdf(elementOrHtml: HTMLElement | string, options: ExportPdfOptions = {}): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const {
        title = 'Dokumen',
        styles = '',
        pageSize = 'A4',
        orientation = 'portrait'
      } = options

      const htmlContent = typeof elementOrHtml === 'string'
        ? elementOrHtml
        : elementOrHtml.outerHTML

      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'

      document.body.appendChild(iframe)

      const doc = iframe.contentWindow?.document
      if (!doc) {
        document.body.removeChild(iframe)
        throw new Error('Unable to access iframe document')
      }

      const defaultStyles = `
        @page {
          size: ${pageSize} ${orientation};
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #111827;
          background: #ffffff;
          margin: 0;
          padding: 0;
          font-size: 13px;
          line-height: 1.5;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 8px 12px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-gray-500 { color: #6b7280; }
        .border-b { border-bottom: 1px solid #e5e7eb; }
        .border-t { border-top: 1px solid #e5e7eb; }
        .border { border: 1px solid #e5e7eb; }
        .bg-gray-50 { background-color: #f9fafb; }
      `

      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>${defaultStyles} ${styles}</style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `)
      doc.close()

      iframe.contentWindow?.focus()

      // Give images / fonts a moment to render
      setTimeout(() => {
        try {
          iframe.contentWindow?.print()
          resolve(true)
        } catch (err) {
          reject(err)
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe)
            }
          }, 1000)
        }
      }, 250)
    } catch (error) {
      reject(error)
    }
  })
}
