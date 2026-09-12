import type { StorageAdapter } from './adapter.interface'
import { IndexedDbStorageAdapter } from './indexed-db.adapter'

export * from './adapter.interface'
export * from './local.adapter'
export * from './indexed-db.adapter'
export * from './cloudinary.adapter'

// Default storage adapter: IndexedDB untuk persistence tanpa server
export const storageAdapter: StorageAdapter = new IndexedDbStorageAdapter()
