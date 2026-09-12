import { ref } from 'vue'
import { storageAdapter } from '@/adapters/storage'

export function useStorage() {
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadFile(file: File | Blob, path?: string): Promise<string> {
    isUploading.value = true
    error.value = null
    try {
      const url = await storageAdapter.upload(file, path)
      return url
    } catch (err: any) {
      error.value = err.message || 'Gagal mengunggah file'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  async function deleteFile(url: string): Promise<void> {
    try {
      await storageAdapter.delete(url)
    } catch (err: any) {
      error.value = err.message || 'Gagal menghapus file'
      throw err
    }
  }

  return {
    isUploading,
    error,
    uploadFile,
    deleteFile,
  }
}
