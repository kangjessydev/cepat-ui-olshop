import type { OrderItem } from '@/types/order'
import type { PaymentMethodOption } from '@/types/payment'

export interface CreatePaymentParams {
  orderId: string
  orderNumber: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  paymentMethodId: string
  returnUrl?: string
  cancelUrl?: string
  description?: string
}

export interface PaymentTransactionResult {
  success: boolean
  provider: 'manual' | 'xendit' | 'midtrans' | string
  reference: string
  paymentUrl?: string
  qrString?: string
  accountNumber?: string
  accountName?: string
  bankName?: string
  expiryDate?: string
  instructions?: string[]
  status: 'pending' | 'settled' | 'expired' | 'failed'
  message?: string
}

export interface PaymentAdapter {
  readonly providerName: string

  /**
   * Cek apakah adapter sudah terkonfigurasi (API key / environment ready)
   */
  isConfigured(): boolean

  /**
   * Ambil daftar metode pembayaran yang tersedia dari adapter ini
   */
  getAvailableMethods(): Promise<PaymentMethodOption[]>

  /**
   * Inisiasi transaksi / checkout pembayaran
   */
  createPayment(params: CreatePaymentParams): Promise<PaymentTransactionResult>

  /**
   * Verifikasi status pembayaran (opsional)
   */
  verifyPayment?(reference: string): Promise<{
    status: 'pending' | 'settled' | 'expired' | 'failed'
    message?: string
  }>
}
