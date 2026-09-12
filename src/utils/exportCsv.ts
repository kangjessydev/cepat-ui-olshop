/**
 * Helper client-side untuk mengekspor data array of objects ke file CSV
 * Zero dependency - menggunakan native Blob dan anchor download
 */
export interface CsvColumn<T = any> {
  key: keyof T | string
  label: string
  formatter?: (value: any, row: T) => string | number
}

export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns?: CsvColumn<T>[]
): void {
  if (!rows || !rows.length) {
    console.warn('[exportToCsv] Tidak ada data untuk diekspor')
    return
  }

  // Tentukan kolom (dari parameter atau otomatis dari keys objek pertama)
  const cols: CsvColumn<T>[] = columns || Object.keys(rows[0]).map(k => ({
    key: k,
    label: k
  }))

  // Header row
  const header = cols.map(c => escapeCsvValue(c.label)).join(',')

  // Data rows
  const csvRows = rows.map(row => {
    return cols.map(c => {
      let val: any
      if (c.formatter) {
        val = c.formatter(row[c.key as keyof T], row)
      } else {
        val = row[c.key as keyof T]
      }
      return escapeCsvValue(val)
    }).join(',')
  })

  const csvContent = '\uFEFF' + [header, ...csvRows].join('\r\n') // \uFEFF untuk support UTF-8 BOM (Excel kompatibel)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""'
  let str = String(val)
  // Ganti kutip ganda menjadi dua kutip ganda
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`
  } else {
    str = `"${str}"`
  }
  return str
}
