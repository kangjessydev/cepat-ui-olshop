import type { StorageAdapter } from './adapter.interface'
import axios from 'axios'

/**
 * Cloudinary Storage Adapter (Production Ready Template)
 * Menggunakan unsigned upload ke Cloudinary API
 */
export class CloudinaryStorageAdapter implements StorageAdapter {
  private cloudName: string
  private uploadPreset: string

  constructor(cloudName?: string, uploadPreset?: string) {
    this.cloudName = cloudName || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
    this.uploadPreset = uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
  }

  async upload(file: File | Blob): Promise<string> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary belum dikonfigurasi. Mohon isi VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET di .env')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', this.uploadPreset)

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    )

    return response.data.secure_url
  }

  async delete(_url: string): Promise<void> {
    // Cloudinary mengharuskan API secret/signature backend untuk delete
    console.warn('Cloudinary direct client-side delete membutuhkan backend signature')
  }
}
