export interface StorageAdapter {
  /**
   * Upload file gambar/dokumen dan kembalikan URL publik atau URL lokal
   */
  upload(file: File | Blob, path?: string): Promise<string>

  /**
   * Hapus file berdasarkan URL atau path
   */
  delete(urlOrPath: string): Promise<void>
}
