import { useToast } from './useToast'
import { useRouter } from 'vue-router'

export interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

export function useErrorHandler() {
  const toast = useToast()
  const router = useRouter()

  function handleError(error: any, customTitle?: string): string {
    let message = 'Terjadi kesalahan sistem yang tidak terduga'
    const status = error?.response?.status || error?.status

    if (!navigator.onLine) {
      message = 'Koneksi internet terputus. Mohon periksa jaringan Anda.'
    } else if (status === 400) {
      message = error?.response?.data?.message || 'Permintaan tidak valid.'
    } else if (status === 401) {
      message = 'Sesi Anda telah berakhir. Silakan login kembali.'
      // redirect ke login jika perlu
      if (router && router.currentRoute.value.path.startsWith('/admin')) {
        router.push('/login')
      }
    } else if (status === 403) {
      message = 'Anda tidak memiliki hak akses untuk melakukan aksi ini.'
    } else if (status === 404) {
      message = error?.response?.data?.message || 'Data atau halaman yang diminta tidak ditemukan.'
    } else if (status === 422) {
      const fieldErrors = error?.response?.data?.errors
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstKey = Object.keys(fieldErrors)[0]
        message = fieldErrors[firstKey]?.[0] || 'Validasi input tidak sesuai.'
      } else {
        message = error?.response?.data?.message || 'Validasi input tidak sesuai.'
      }
    } else if (status >= 500) {
      message = 'Terjadi gangguan pada server. Silakan coba kembali nanti.'
    } else if (error?.message) {
      message = error.message
    }

    toast.error(message, customTitle || 'Perhatian')
    return message
  }

  return {
    handleError
  }
}
