import type { Order, OrderStatus } from '@/types'
import type { IOrderRepository } from './types'
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '@/constants/storage'
import { ordersSeed } from '@/mock/orders.seed'
import { useAdminApi, useCustomerApi } from '@/core/composables/useApi'

export class LocalOrderRepository implements IOrderRepository {
  private load(): Order[] {
    const raw = getStorageItem(STORAGE_KEYS.ORDERS, 'cepat_orders')
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        return [...ordersSeed]
      }
    }
    this.save([...ordersSeed])
    return [...ordersSeed]
  }

  private save(orders: Order[]): void {
    setStorageItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders), 'cepat_orders')
  }

  async getAll(): Promise<Order[]> {
    return this.load()
  }

  async getById(id: string): Promise<Order | null> {
    const orders = this.load()
    return orders.find(o => o.id === id) || null
  }

  async getByCustomer(customerId: string): Promise<Order[]> {
    const orders = this.load()
    return orders.filter(o => o.customerId === customerId)
  }

  async create(order: Order): Promise<Order> {
    const orders = this.load()
    orders.unshift(order)
    this.save(orders)
    return order
  }

  async updateStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null> {
    const orders = this.load()
    const idx = orders.findIndex(o => o.id === orderId)
    if (idx === -1) return null
    orders[idx] = {
      ...orders[idx],
      status,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...(orders[idx].timeline || []),
        {
          id: `time_${Date.now()}`,
          status,
          title: `Status diubah ke ${status}`,
          description: note || '',
          timestamp: new Date().toISOString()
        }
      ]
    }
    this.save(orders)
    return orders[idx]
  }

  async updateTracking(orderId: string, trackingNumber: string, courier: string): Promise<Order | null> {
    const orders = this.load()
    const idx = orders.findIndex(o => o.id === orderId)
    if (idx === -1) return null
    orders[idx] = {
      ...orders[idx],
      status: 'shipped',
      updatedAt: new Date().toISOString(),
      shipping: {
        ...orders[idx].shipping,
        courierName: courier,
        trackingNumber
      },
      timeline: [
        ...(orders[idx].timeline || []),
        {
          id: `time_${Date.now()}`,
          status: 'shipped',
          title: 'Pesanan Dikirim',
          description: `Nomor resi ${trackingNumber} (${courier})`,
          timestamp: new Date().toISOString()
        }
      ]
    }
    this.save(orders)
    return orders[idx]
  }

  async track(orderNumberOrPhone: string): Promise<Order | null> {
    const orders = this.load()
    const query = orderNumberOrPhone.trim().toLowerCase()
    return orders.find(o =>
      o.orderNumber.toLowerCase() === query ||
      o.id.toLowerCase() === query ||
      (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, ''))
    ) || null
  }
}

/**
 * ApiOrderRepository for Laravel REST backend
 */
export class ApiOrderRepository implements IOrderRepository {
  private adminApi = useAdminApi()
  private customerApi = useCustomerApi()

  async getAll(): Promise<Order[]> {
    const res = await this.adminApi.get<Order[]>('/orders')
    return res || []
  }

  async getById(id: string): Promise<Order | null> {
    return await this.customerApi.get<Order>(`/orders/${id}`)
  }

  async getByCustomer(_customerId: string): Promise<Order[]> {
    const res = await this.customerApi.get<Order[]>('/account/orders')
    return res || []
  }

  async create(order: Order): Promise<Order> {
    const res = await this.customerApi.post<Order>('/orders', order)
    if (!res) throw new Error('Gagal membuat pesanan')
    return res
  }

  async updateStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null> {
    return await this.adminApi.patch<Order>(`/orders/${orderId}/status`, { status, note })
  }

  async updateTracking(orderId: string, trackingNumber: string, courier: string): Promise<Order | null> {
    return await this.adminApi.patch<Order>(`/orders/${orderId}/tracking`, { trackingNumber, courier })
  }

  async track(orderNumberOrPhone: string): Promise<Order | null> {
    return await this.customerApi.get<Order>(`/orders/track/${encodeURIComponent(orderNumberOrPhone)}`)
  }
}

export const orderRepository: IOrderRepository = new LocalOrderRepository()
