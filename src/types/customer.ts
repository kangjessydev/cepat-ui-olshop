import type { CustomerAddress } from './order'

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalOrders: number
  totalSpent: number
  addresses: CustomerAddress[]
  defaultAddressIndex?: number
  createdAt: string
  updatedAt: string
}
