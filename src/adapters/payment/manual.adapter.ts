import type { PaymentAdapter, CreatePaymentParams, PaymentTransactionResult } from './adapter.interface'
import type { PaymentMethodOption } from '@/types/payment'

export class ManualPaymentAdapter implements PaymentAdapter {
  readonly providerName = 'manual'

  isConfigured(): boolean {
    return true
  }

  async getAvailableMethods(): Promise<PaymentMethodOption[]> {
    return [
      {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'Transfer Bank (Verifikasi Manual)',
        description: 'Transfer ke rekening BCA, Mandiri, atau BNI lalu unggah bukti transfer.',
        isEnabled: true,
        bankAccounts: [
          {
            id: 'bca',
            bankName: 'BCA',
            accountNumber: '8830123456',
            accountName: 'PT CEPAT OLSHOP INDONESIA',
            instructions: [
              'Buka aplikasi BCA Mobile / ATM BCA',
              'Pilih Transfer > Rekening BCA',
              'Masukkan nomor rekening 8830123456 a.n. PT CEPAT OLSHOP INDONESIA',
              'Masukkan nominal tepat hingga rupiah terakhir',
              'Simpan struk atau screenshot bukti transfer untuk diunggah di halaman pesanan'
            ]
          },
          {
            id: 'mandiri',
            bankName: 'Mandiri',
            accountNumber: '1680009876543',
            accountName: 'PT CEPAT OLSHOP INDONESIA',
            instructions: [
              'Buka aplikasi Livin by Mandiri / ATM Mandiri',
              'Pilih Transfer Rupiah > Rekening Mandiri',
              'Masukkan nomor rekening 1680009876543 a.n. PT CEPAT OLSHOP INDONESIA',
              'Masukkan nominal pembayaran',
              'Simpan bukti transfer untuk konfirmasi'
            ]
          }
        ]
      },
      {
        id: 'cod',
        type: 'cod',
        name: 'Bayar di Tempat (COD)',
        description: 'Bayar tunai ke kurir saat barang sampai di alamat pengiriman.',
        isEnabled: true
      }
    ]
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentTransactionResult> {
    const isCod = params.paymentMethodId === 'cod'

    if (isCod) {
      return {
        success: true,
        provider: 'manual',
        reference: `COD-${params.orderNumber}`,
        status: 'pending',
        instructions: [
          'Siapkan uang tunai pas saat kurir tiba di alamat Anda',
          'Pastikan nomor handphone/WhatsApp aktif untuk dihubungi kurir'
        ],
        message: 'Pesanan dengan metode COD berhasil dibuat'
      }
    }

    return {
      success: true,
      provider: 'manual',
      reference: `MANUAL-${params.orderNumber}`,
      status: 'pending',
      bankName: 'BCA',
      accountNumber: '8830123456',
      accountName: 'PT CEPAT OLSHOP INDONESIA',
      instructions: [
        'Transfer ke rekening BCA 8830123456 a.n. PT CEPAT OLSHOP INDONESIA',
        `Nominal transfer: Rp ${params.amount.toLocaleString('id-ID')}`,
        'Unggah foto bukti transfer di halaman konfirmasi pesanan agar dapat segera diverifikasi admin'
      ],
      message: 'Silakan lakukan pembayaran sesuai instruksi rekening di atas'
    }
  }

  async verifyPayment(reference: string): Promise<{ status: 'pending' | 'settled' | 'expired' | 'failed'; message?: string }> {
    return {
      status: 'pending',
      message: `Menunggu verifikasi pembayaran manual untuk referensi ${reference}`
    }
  }
}
