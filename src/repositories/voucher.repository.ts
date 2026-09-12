import type { Voucher } from '@/types'
import type { IVoucherRepository } from './types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/constants/storage'
import { vouchersSeed } from '@/mock/vouchers.seed'
import { useAdminApi, useCustomerApi } from '@/core/composables/useApi'

export class LocalVoucherRepository implements IVoucherRepository {
  private load(): Voucher[] {
    const raw = getStorageItem(STORAGE_KEYS.VOUCHERS, 'cepat_vouchers')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return [...vouchersSeed]
      }
    }
    this.save([...vouchersSeed])
    return [...vouchersSeed]
  }

  private save(vouchers: Voucher[]): void {
    setStorageItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(vouchers), 'cepat_vouchers')
  }

  async getAll(): Promise<Voucher[]> {
    return this.load()
  }

  async getById(id: string): Promise<Voucher | null> {
    const vouchers = this.load()
    return vouchers.find(v => v.id === id) || null
  }

  async getByCode(code: string): Promise<Voucher | null> {
    const vouchers = this.load()
    return vouchers.find(v => v.code.toUpperCase() === code.trim().toUpperCase()) || null
  }

  async validate(code: string, subtotal: number): Promise<{
    valid: boolean
    discountAmount: number
    message?: string
    voucher?: Voucher
  }> {
    const voucher = await this.getByCode(code)
    if (!voucher) {
      return { valid: false, discountAmount: 0, message: 'Kode voucher tidak ditemukan' }
    }
    if (!voucher.isActive) {
      return { valid: false, discountAmount: 0, message: 'Voucher sudah tidak aktif' }
    }
    if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimal belanja Rp ${voucher.minOrderAmount.toLocaleString('id-ID')} untuk menggunakan voucher ini`
      }
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return { valid: false, discountAmount: 0, message: 'Kuota pemakaian voucher telah habis' }
    }

    let discount = 0
    if (voucher.discountType === 'percentage') {
      discount = (subtotal * voucher.discountValue) / 100
      if (voucher.maxDiscount && discount > voucher.maxDiscount) {
        discount = voucher.maxDiscount
      }
    } else {
      discount = voucher.discountValue
    }

    return {
      valid: true,
      discountAmount: discount,
      voucher,
      message: `Voucher ${voucher.code} berhasil digunakan!`
    }
  }

  async create(voucher: Voucher): Promise<Voucher> {
    const vouchers = this.load()
    vouchers.unshift(voucher)
    this.save(vouchers)
    return voucher
  }

  async update(id: string, updates: Partial<Voucher>): Promise<Voucher | null> {
    const vouchers = this.load()
    const idx = vouchers.findIndex(v => v.id === id)
    if (idx === -1) return null
    vouchers[idx] = { ...vouchers[idx], ...updates }
    this.save(vouchers)
    return vouchers[idx]
  }

  async delete(id: string): Promise<boolean> {
    const vouchers = this.load()
    const filtered = vouchers.filter(v => v.id !== id)
    if (filtered.length === vouchers.length) return false
    this.save(filtered)
    return true
  }
}

export class ApiVoucherRepository implements IVoucherRepository {
  private adminApi = useAdminApi()
  private customerApi = useCustomerApi()

  async getAll(): Promise<Voucher[]> {
    const res = await this.adminApi.get<Voucher[]>('/vouchers')
    return res || []
  }

  async getByCode(code: string): Promise<Voucher | null> {
    return await this.customerApi.get<Voucher>(`/vouchers/${encodeURIComponent(code)}`)
  }

  async validate(code: string, subtotal: number): Promise<{
    valid: boolean
    discountAmount: number
    message?: string
    voucher?: Voucher
  }> {
    const res = await this.customerApi.post<{
      valid: boolean
      discountAmount: number
      message?: string
      voucher?: Voucher
    }>('/vouchers/validate', { code, subtotal })
    return res || { valid: false, discountAmount: 0, message: 'Voucher tidak valid' }
  }

  async create(voucher: Voucher): Promise<Voucher> {
    const res = await this.adminApi.post<Voucher>('/vouchers', voucher)
    if (!res) throw new Error('Gagal membuat voucher')
    return res
  }

  async update(id: string, updates: Partial<Voucher>): Promise<Voucher | null> {
    return await this.adminApi.put<Voucher>(`/vouchers/${id}`, updates)
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.adminApi.delete(`/vouchers/${id}`)
    return !!res
  }
}

export const voucherRepository: IVoucherRepository = new LocalVoucherRepository()
