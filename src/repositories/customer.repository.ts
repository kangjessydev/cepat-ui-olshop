import type { Customer } from '@/types'
import type { ICustomerRepository } from './types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/constants/storage'
import { customersSeed } from '@/mock/customers.seed'
import { useAdminApi, useCustomerApi } from '@/core/composables/useApi'

export class LocalCustomerRepository implements ICustomerRepository {
  private load(): Customer[] {
    const raw = getStorageItem(STORAGE_KEYS.CUSTOMERS, 'cepat_customers')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return [...customersSeed]
      }
    }
    this.save([...customersSeed])
    return [...customersSeed]
  }

  private save(customers: Customer[]): void {
    setStorageItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers), 'cepat_customers')
  }

  async getAll(): Promise<Customer[]> {
    return this.load()
  }

  async getById(id: string): Promise<Customer | null> {
    const customers = this.load()
    return customers.find(c => c.id === id) || null
  }

  async getByEmail(email: string): Promise<Customer | null> {
    const customers = this.load()
    return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null
  }

  async create(customer: Customer): Promise<Customer> {
    const customers = this.load()
    customers.unshift(customer)
    this.save(customers)
    return customer
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const customers = this.load()
    const idx = customers.findIndex(c => c.id === id)
    if (idx === -1) return null
    customers[idx] = {
      ...customers[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.save(customers)
    return customers[idx]
  }
}

export class ApiCustomerRepository implements ICustomerRepository {
  private adminApi = useAdminApi()
  private customerApi = useCustomerApi()

  async getAll(): Promise<Customer[]> {
    const res = await this.adminApi.get<Customer[]>('/customers')
    return res || []
  }

  async getById(id: string): Promise<Customer | null> {
    return await this.adminApi.get<Customer>(`/customers/${id}`)
  }

  async getByEmail(email: string): Promise<Customer | null> {
    return await this.adminApi.get<Customer>(`/customers/by-email?email=${encodeURIComponent(email)}`)
  }

  async create(customer: Customer): Promise<Customer> {
    const res = await this.adminApi.post<Customer>('/customers', customer)
    if (!res) throw new Error('Gagal menambah pelanggan')
    return res
  }

  async update(_id: string, updates: Partial<Customer>): Promise<Customer | null> {
    return await this.customerApi.put<Customer>(`/account/profile`, updates)
  }
}

export const customerRepository: ICustomerRepository = new LocalCustomerRepository()
