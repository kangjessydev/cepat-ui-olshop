import type { StorageAdapter } from './adapter.interface'

/**
 * Local in-memory Storage Adapter
 * Menggunakan URL.createObjectURL(file). Ringan dan cocok untuk dev/test instan.
 */
export class LocalStorageAdapter implements StorageAdapter {
  private objectUrls = new Set<string>()

  async upload(file: File | Blob): Promise<string> {
    const url = URL.createObjectURL(file)
    this.objectUrls.add(url)
    return url
  }

  async delete(url: string): Promise<void> {
    if (this.objectUrls.has(url)) {
      URL.revokeObjectURL(url)
      this.objectUrls.delete(url)
    }
  }
}
