import type {
  Product,
  Order,
  OrderStatus,
  Customer,
  Voucher,
  ProductReview
} from '@/types'

export interface IProductRepository {
  getAll(): Promise<Product[]>
  getById(id: string): Promise<Product | null>
  create(product: Omit<Product, 'id'>): Promise<Product>
  update(id: string, updates: Partial<Product>): Promise<Product | null>
  delete(id: string): Promise<boolean>
  deductStock(items: { productId: string; quantity: number }[]): Promise<boolean>
}

export interface IOrderRepository {
  getAll(): Promise<Order[]>
  getById(id: string): Promise<Order | null>
  getByCustomer(customerId: string): Promise<Order[]>
  create(order: Order): Promise<Order>
  updateStatus(orderId: string, status: OrderStatus, note?: string): Promise<Order | null>
  updateTracking(orderId: string, trackingNumber: string, courier: string): Promise<Order | null>
  track(orderNumberOrPhone: string): Promise<Order | null>
}

export interface ICustomerRepository {
  getAll(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  getByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<Customer>
  update(id: string, updates: Partial<Customer>): Promise<Customer | null>
}

export interface IVoucherRepository {
  getAll(): Promise<Voucher[]>
  getByCode(code: string): Promise<Voucher | null>
  validate(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; message?: string; voucher?: Voucher }>
  create(voucher: Voucher): Promise<Voucher>
  update(id: string, updates: Partial<Voucher>): Promise<Voucher | null>
  delete(id: string): Promise<boolean>
}

export interface IReviewRepository {
  getAll(): Promise<ProductReview[]>
  getByProduct(productId: string): Promise<ProductReview[]>
  create(review: ProductReview): Promise<ProductReview>
  updateStatus(id: string, status: 'approved' | 'rejected'): Promise<ProductReview | null>
  reply(id: string, replyText: string): Promise<ProductReview | null>
}
