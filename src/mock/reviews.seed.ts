import type { ProductReview } from '@/types'

export const reviewsSeed: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Kemeja Linen Oversized Relaxed Fit',
    customerId: 'cust-1',
    customerName: 'Jessica Aurelia',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Bahan linennya beneran adem dan jatuhnya bagus banget! Warna sage green-nya sangat estetik sesuai foto. Jahitan rapi sekali.',
    status: 'approved',
    createdAt: '2026-09-08T10:15:00Z',
    reply: {
      comment: 'Terima kasih banyak ulasannya Kak Jessica! Senang kemejanya pas dan nyaman dipakai :)',
      createdAt: '2026-09-08T11:00:00Z'
    }
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'Smartwatch AMOLED Ultra Thin Titanium Case',
    customerId: 'cust-2',
    customerName: 'Budi Santoso',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Layar AMOLED-nya terang banget pas di luar ruangan di bawah terik matahari. Baterai awet 10 hari pemakaian normal. Kualitas build titanium sangat kokoh.',
    status: 'approved',
    createdAt: '2026-09-05T14:20:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    productName: 'Wireless Earbuds TWS ANC Active Noise Cancelling',
    customerId: 'cust-3',
    customerName: 'Dimas Pratama',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 4,
    comment: 'Kualitas suara bass solid dan ANC cukup kedap untuk di kantor/kafe. Cuma fitting di telinga butuh penyesuaian eartip dulu.',
    status: 'approved',
    createdAt: '2026-09-02T09:40:00Z'
  },
  {
    id: 'rev-4',
    productId: 'prod-5',
    productName: 'Sepatu Sneaker Retro Running Classic White',
    customerId: 'cust-4',
    customerName: 'Siti Rahmawati',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Sepatunya empuk pol! Buat jalan seharian di mall atau jalan santai gak bikin tumit pegal. Model klasiknya gampang dimix-and-match.',
    status: 'approved',
    createdAt: '2026-08-28T16:50:00Z'
  },
  {
    id: 'rev-5',
    productId: 'prod-3',
    productName: 'Tas Ransel Kanvas Anti-Air Urban Commuter',
    customerId: 'cust-6',
    customerName: 'Rian Hidayat',
    rating: 4,
    comment: 'Kapasitas muat banyak, laptop 15.6 inch masuk dengan aman. Sempat kena gerimis airnya langsung mengalir turun gak meresap.',
    status: 'pending', // Menunggu moderasi admin!
    createdAt: '2026-09-12T08:00:00Z'
  }
]
