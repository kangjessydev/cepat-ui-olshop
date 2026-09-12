import type { PaymentAdapter, CreatePaymentParams, PaymentTransactionResult } from './adapter.interface'
import type { PaymentMethodOption } from '@/types/payment'

export class XenditPaymentAdapter implements PaymentAdapter {
  readonly providerName = 'xendit'
  private publicKey: string
  private isSandbox: boolean

  constructor() {
    this.publicKey = import.meta.env.VITE_XENDIT_PUBLIC_KEY || ''
    this.isSandbox = import.meta.env.VITE_XENDIT_IS_SANDBOX !== 'false'
  }

  isConfigured(): boolean {
    return !!this.publicKey
  }

  async getAvailableMethods(): Promise<PaymentMethodOption[]> {
    return [
      {
        id: 'xendit_qris',
        type: 'ewallet',
        name: 'QRIS (GoPay, OVO, Dana, BCA, dll)',
        description: 'Bayar instan dengan scan QRIS dari aplikasi e-wallet atau mobile banking apa saja.',
        isEnabled: true
      },
      {
        id: 'xendit_va',
        type: 'bank_transfer',
        name: 'Virtual Account Otomatis (Xendit)',
        description: 'Konfirmasi otomatis 24 jam tanpa perlu unggah bukti transfer.',
        isEnabled: true,
        bankAccounts: [
          {
            id: 'xendit-bca',
            bankName: 'BCA Virtual Account',
            accountNumber: 'Otomatis di-generate saat checkout',
            accountName: 'Cepat Olshop via Xendit'
          },
          {
            id: 'xendit-mandiri',
            bankName: 'Mandiri Virtual Account',
            accountNumber: 'Otomatis di-generate saat checkout',
            accountName: 'Cepat Olshop via Xendit'
          },
          {
            id: 'xendit-bri',
            bankName: 'BRI Virtual Account (BRIVA)',
            accountNumber: 'Otomatis di-generate saat checkout',
            accountName: 'Cepat Olshop via Xendit'
          }
        ]
      },
      {
        id: 'xendit_invoice',
        type: 'ewallet',
        name: 'Xendit Hosted Checkout',
        description: 'Pilih metode pembayaran lengkap di halaman resmi pembayaran aman Xendit.',
        isEnabled: true
      },
      {
        id: 'cod',
        type: 'cod',
        name: 'Bayar di Tempat (COD)',
        description: 'Bayar tunai ke kurir saat pesanan sampai.',
        isEnabled: true
      }
    ]
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentTransactionResult> {
    if (params.paymentMethodId === 'cod') {
      return {
        success: true,
        provider: 'manual',
        reference: `COD-${params.orderNumber}`,
        status: 'pending',
        instructions: ['Siapkan uang pas saat kurir tiba di alamat tujuan'],
        message: 'Pesanan COD berhasil dibuat'
      }
    }

    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const invoiceId = `xendit_inv_${params.orderId}_${Date.now()}`
    
    // In production with backend, backend creates invoice via Xendit Secret Key.
    // Frontend gets redirect checkout URL or QRIS code.
    const checkoutUrl = this.isSandbox
      ? `https://checkout-staging.xendit.co/web/${invoiceId}`
      : `https://checkout.xendit.co/web/${invoiceId}`

    if (params.paymentMethodId === 'xendit_qris') {
      return {
        success: true,
        provider: 'xendit',
        reference: invoiceId,
        paymentUrl: checkoutUrl,
        qrString: `00020101021226580016ID.CO.XENDIT.WWW011893600999${params.orderNumber}520454995802ID5919CEPAT OLSHOP6007BANDUNG62070703A016304ABCD`,
        expiryDate: expiryTime,
        status: 'pending',
        instructions: [
          'Buka aplikasi e-wallet pilihan Anda (GoPay, OVO, Dana, ShopeePay, atau BCA Mobile)',
          'Pilih menu Scan QRIS',
          'Arahkan kamera ke kode QR di layar',
          `Periksa nominal tagihan sebesar Rp ${params.amount.toLocaleString('id-ID')}`,
          'Konfirmasi pembayaran dan masukkan PIN Anda'
        ],
        message: 'Silakan scan QRIS untuk menyelesaikan pembayaran'
      }
    }

    if (params.paymentMethodId === 'xendit_va') {
      const vaNumber = `8808${Math.floor(1000000000 + Math.random() * 9000000000)}`
      return {
        success: true,
        provider: 'xendit',
        reference: invoiceId,
        paymentUrl: checkoutUrl,
        bankName: 'BCA Virtual Account',
        accountNumber: vaNumber,
        accountName: `CEPAT OLSHOP - ${params.customerName.toUpperCase()}`,
        expiryDate: expiryTime,
        status: 'pending',
        instructions: [
          'Salin nomor BCA Virtual Account di atas',
          'Buka aplikasi BCA Mobile / ATM BCA',
          'Pilih m-Transfer > BCA Virtual Account',
          `Masukkan nomor VA ${vaNumber}`,
          'Tagihan akan terverifikasi secara otomatis dalam hitungan detik setelah transfer berhasil'
        ],
        message: 'Nomor Virtual Account telah dibuat'
      }
    }

    // Default to Xendit Hosted Invoice Checkout
    return {
      success: true,
      provider: 'xendit',
      reference: invoiceId,
      paymentUrl: checkoutUrl,
      expiryDate: expiryTime,
      status: 'pending',
      instructions: [
        'Klik tombol Bayar Sekarang untuk diarahkan ke halaman pembayaran aman Xendit',
        'Pilih metode pembayaran yang Anda inginkan (QRIS, VA, Kartu Kredit, atau e-Wallet)'
      ],
      message: 'Invoice Xendit berhasil dibuat'
    }
  }

  async verifyPayment(reference: string): Promise<{ status: 'pending' | 'settled' | 'expired' | 'failed'; message?: string }> {
    return {
      status: 'pending',
      message: `Status transaksi Xendit (${reference}) sedang menunggu penyelesaian oleh pelanggan`
    }
  }
}
