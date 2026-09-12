import type { StorageAdapter } from './adapter.interface'

const DB_NAME = 'cepat_olshop_storage'
const STORE_NAME = 'files'

/**
 * Persistent IndexedDB Storage Adapter
 * Menyimpan file/gambar sebagai base64/blob di browser IndexedDB.
 * Persistent antar refresh tanpa memerlukan backend.
 */
export class IndexedDbStorageAdapter implements StorageAdapter {
  private dbPromise: Promise<IDBDatabase>

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async upload(file: File | Blob): Promise<string> {
    const db = await this.dbPromise
    const id = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    // Convert to base64 data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const putReq = store.put({ id, dataUrl, createdAt: new Date().toISOString() })
      putReq.onsuccess = () => resolve(dataUrl)
      putReq.onerror = () => reject(putReq.error)
    })
  }

  async delete(_urlOrPath: string): Promise<void> {
    // Di IndexedDB dataUrl bisa disimpan/dihapus jika id diketahui
    return Promise.resolve()
  }
}
