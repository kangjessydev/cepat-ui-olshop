import type { Voucher, FlashSaleEvent } from '@/types'

export const vouchersSeed: Voucher[] = [
  {
    id: 'vouch-1',
    code: 'CEPATHEMAT',
    title: 'Diskon Belanja Pengguna Baru',
    description: 'Potongan langsung Rp 20.000 untuk transaksi pertama minimal Rp 100.000',
    discountType: 'fixed',
    discountValue: 20000,
    minOrderAmount: 100000,
    usageLimit: 500,
    usedCount: 142,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-10-31T23:59:59Z',
    isActive: true
  },
  {
    id: 'vouch-2',
    code: 'GAJIAN10',
    title: 'Promo Gajian 10% Off',
    description: 'Diskon 10% hingga maksimal Rp 50.000 untuk semua kategori produk',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 50000,
    minOrderAmount: 250000,
    usageLimit: 200,
    usedCount: 89,
    startDate: '2026-09-25T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    isActive: true
  },
  {
    id: 'vouch-3',
    code: 'ONGKIRFREE',
    title: 'Potongan Ongkir Rp 15.000',
    description: 'Subsidi ongkos kirim ke seluruh pulau Jawa',
    discountType: 'fixed',
    discountValue: 15000,
    minOrderAmount: 150000,
    usageLimit: 300,
    usedCount: 198,
    startDate: '2026-09-01T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    isActive: true
  }
]

export const flashSaleSeed: FlashSaleEvent = {
  id: 'fs-01',
  name: 'Super Flash Sale Weekend',
  startDate: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // Mulai 4 jam lalu
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),  // Berakhir 20 jam ke depan
  isActive: true,
  showOnHome: true,
  items: [
    {
      productId: 'prod-4',
      productName: 'Wireless Earbuds TWS ANC Active Noise Cancelling',
      productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      originalPrice: 499000,
      flashPrice: 299000,
      discountPercent: 40,
      stockQuota: 30,
      soldQuota: 22
    },
    {
      productId: 'prod-6',
      productName: 'Tumbler Stainless Steel Double Wall 600ml',
      productImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      originalPrice: 179000,
      flashPrice: 119000,
      discountPercent: 34,
      stockQuota: 50,
      soldQuota: 41
    },
    {
      productId: 'prod-10',
      productName: 'GaN Fast Charger 65W 3-Port Type-C & USB-A',
      productImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      originalPrice: 299000,
      flashPrice: 179000,
      discountPercent: 40,
      stockQuota: 25,
      soldQuota: 18
    }
  ]
}
