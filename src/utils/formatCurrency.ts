/**
 * Utility helpers untuk formatting mata uang (Default: Rupiah / IDR)
 */

export function formatRupiah(amount: number | string | null | undefined, showPrefix = true): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return showPrefix ? 'Rp 0' : '0'
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0
  }).format(num)

  return showPrefix ? `Rp ${formatted}` : formatted
}

export function formatCompactNumber(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '0'

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}jt`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}rb`
  }
  return String(num)
}
