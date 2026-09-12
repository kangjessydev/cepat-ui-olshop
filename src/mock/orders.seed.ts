import type { Order } from '@/types'

export const ordersSeed: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-202609-001',
    customerId: 'cust-1',
    customerName: 'Jessica Aurelia',
    customerEmail: 'jessica.aurelia@gmail.com',
    customerPhone: '081234567890',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Kemeja Linen Oversized Relaxed Fit',
        productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Warna: Sage Green, Ukuran: M',
        price: 249000,
        quantity: 1,
        subtotal: 249000
      },
      {
        id: 'item-2',
        productId: 'prod-6',
        productName: 'Tumbler Stainless Steel Double Wall 600ml',
        productImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Warna: Sage Green',
        price: 139000,
        quantity: 1,
        subtotal: 139000
      }
    ],
    subtotal: 388000,
    shippingCost: 14000,
    discountAmount: 20000,
    totalAmount: 382000,
    status: 'pending_payment',
    shipping: {
      courierName: 'J&T',
      serviceName: 'J&T EZ',
      cost: 14000,
      estimatedDelivery: '1 - 2 Hari',
      address: {
        recipientName: 'Jessica Aurelia',
        phone: '081234567890',
        addressLine: 'Jl. Surya Kencana No. 42, RT 03 / RW 05',
        subdistrict: 'Bogor Tengah',
        city: 'Kota Bogor',
        province: 'Jawa Barat',
        postalCode: '16123',
        notes: 'Pagar warna hitam, titip satpam jika tidak ada di rumah'
      }
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'BCA',
      accountNumber: '8830123456',
      accountName: 'PT CEPAT OLSHOP INDONESIA',
      proofImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      status: 'verification_pending'
    },
    timeline: [
      {
        id: 'tl-1',
        title: 'Pesanan Dibuat',
        description: 'Customer telah menyelesaikan proses checkout di website',
        timestamp: '2026-09-12T07:15:00Z',
        status: 'pending_payment',
        actor: 'customer'
      },
      {
        id: 'tl-2',
        title: 'Bukti Transfer Diunggah',
        description: 'Pelanggan telah mengunggah bukti bayar transfer BCA Rp 382.000',
        timestamp: '2026-09-12T07:30:00Z',
        status: 'pending_payment',
        actor: 'customer'
      }
    ],
    createdAt: '2026-09-12T07:15:00Z',
    updatedAt: '2026-09-12T07:30:00Z'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-202609-002',
    customerId: 'cust-2',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.santoso@yahoo.com',
    customerPhone: '082198765432',
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Smartwatch AMOLED Ultra Thin Titanium Case',
        productImage: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Tali Jam: Black Fluororubber',
        price: 899000,
        quantity: 1,
        subtotal: 899000
      }
    ],
    subtotal: 899000,
    shippingCost: 12000,
    discountAmount: 0,
    totalAmount: 911000,
    status: 'processing',
    shipping: {
      courierName: 'JNE',
      serviceName: 'JNE Regular',
      cost: 12000,
      estimatedDelivery: '2 - 3 Hari',
      address: {
        recipientName: 'Budi Santoso',
        phone: '082198765432',
        addressLine: 'Ruko Puri Kencana Blok A No. 12',
        subdistrict: 'Kembangan',
        city: 'Jakarta Barat',
        province: 'DKI Jakarta',
        postalCode: '11610'
      }
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'BCA',
      accountNumber: '8830123456',
      accountName: 'PT CEPAT OLSHOP INDONESIA',
      status: 'paid',
      paidAt: '2026-09-12T05:40:00Z',
      confirmedAt: '2026-09-12T06:00:00Z'
    },
    timeline: [
      {
        id: 'tl-3',
        title: 'Pesanan Dibuat',
        timestamp: '2026-09-12T05:20:00Z',
        status: 'pending_payment',
        actor: 'customer'
      },
      {
        id: 'tl-4',
        title: 'Pembayaran Dikonfirmasi',
        description: 'Admin memverifikasi dana masuk Rp 911.000',
        timestamp: '2026-09-12T06:00:00Z',
        status: 'processing',
        actor: 'admin'
      }
    ],
    createdAt: '2026-09-12T05:20:00Z',
    updatedAt: '2026-09-12T06:00:00Z'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-202609-003',
    customerId: 'cust-3',
    customerName: 'Dimas Pratama',
    customerEmail: 'dimas.pratama@outlook.com',
    customerPhone: '085712345678',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Wireless Earbuds TWS ANC Active Noise Cancelling',
        productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Warna: Matte Black',
        price: 349000,
        quantity: 1,
        subtotal: 349000
      },
      {
        id: 'item-5',
        productId: 'prod-10',
        productName: 'GaN Fast Charger 65W 3-Port Type-C & USB-A',
        productImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        price: 199000,
        quantity: 1,
        subtotal: 199000
      }
    ],
    subtotal: 548000,
    shippingCost: 19000,
    discountAmount: 25000,
    totalAmount: 542000,
    status: 'shipped',
    shipping: {
      courierName: 'SiCepat',
      serviceName: 'SiCepat BEST',
      cost: 19000,
      trackingNumber: '003291882736',
      estimatedDelivery: '1 Hari',
      address: {
        recipientName: 'Dimas Pratama',
        phone: '085712345678',
        addressLine: 'Jl. Dago Asri No. 17',
        subdistrict: 'Coblong',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        postalCode: '40135'
      }
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'Mandiri',
      status: 'paid',
      paidAt: '2026-09-11T14:10:00Z',
      confirmedAt: '2026-09-11T14:30:00Z'
    },
    timeline: [
      {
        id: 'tl-5',
        title: 'Pesanan Dibuat',
        timestamp: '2026-09-11T14:00:00Z',
        status: 'pending_payment',
        actor: 'customer'
      },
      {
        id: 'tl-6',
        title: 'Pembayaran Diterima',
        timestamp: '2026-09-11T14:30:00Z',
        status: 'processing',
        actor: 'admin'
      },
      {
        id: 'tl-7',
        title: 'Paket Diserahkan ke Kurir',
        description: 'Nomor resi pengiriman SiCepat: 003291882736',
        timestamp: '2026-09-11T17:45:00Z',
        status: 'shipped',
        actor: 'admin'
      }
    ],
    createdAt: '2026-09-11T14:00:00Z',
    updatedAt: '2026-09-11T17:45:00Z'
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-202609-004',
    customerId: 'cust-4',
    customerName: 'Siti Rahmawati',
    customerEmail: 'siti.rahma@gmail.com',
    customerPhone: '081398712345',
    items: [
      {
        id: 'item-6',
        productId: 'prod-5',
        productName: 'Sepatu Sneaker Retro Running Classic White',
        productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Ukuran: 41',
        price: 459000,
        quantity: 1,
        subtotal: 459000
      }
    ],
    subtotal: 459000,
    shippingCost: 14000,
    discountAmount: 0,
    totalAmount: 473000,
    status: 'delivered',
    shipping: {
      courierName: 'J&T',
      serviceName: 'J&T EZ',
      cost: 14000,
      trackingNumber: 'JT8839201928',
      estimatedDelivery: '1 - 2 Hari',
      address: {
        recipientName: 'Siti Rahmawati',
        phone: '081398712345',
        addressLine: 'Komplek Griya Indah Blok C3 No. 8',
        subdistrict: 'Gayungan',
        city: 'Kota Surabaya',
        province: 'Jawa Timur',
        postalCode: '60235'
      }
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'BCA',
      status: 'paid',
      paidAt: '2026-09-09T08:00:00Z',
      confirmedAt: '2026-09-09T08:30:00Z'
    },
    timeline: [
      { id: 'tl-8', title: 'Pesanan Dibuat', timestamp: '2026-09-09T07:45:00Z', status: 'pending_payment', actor: 'customer' },
      { id: 'tl-9', title: 'Pembayaran Diterima', timestamp: '2026-09-09T08:30:00Z', status: 'processing', actor: 'admin' },
      { id: 'tl-10', title: 'Dikirim', description: 'Resi J&T: JT8839201928', timestamp: '2026-09-09T16:00:00Z', status: 'shipped', actor: 'admin' },
      { id: 'tl-11', title: 'Pesanan Telah Tiba', description: 'Diterima oleh Siti Rahmawati (Ybs)', timestamp: '2026-09-11T11:20:00Z', status: 'delivered', actor: 'system' }
    ],
    createdAt: '2026-09-09T07:45:00Z',
    updatedAt: '2026-09-11T11:20:00Z'
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-202609-005',
    customerId: 'cust-5',
    customerName: 'Ahmad Faisal',
    customerEmail: 'ahmad.faisal@gmail.com',
    customerPhone: '087812903487',
    items: [
      {
        id: 'item-7',
        productId: 'prod-3',
        productName: 'Tas Ransel Kanvas Anti-Air Urban Commuter',
        productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
        variantDescription: 'Warna: Classic Black',
        price: 389000,
        quantity: 1,
        subtotal: 389000
      }
    ],
    subtotal: 389000,
    shippingCost: 15000,
    discountAmount: 0,
    totalAmount: 404000,
    status: 'cancelled',
    shipping: {
      courierName: 'JNE',
      serviceName: 'JNE Regular',
      cost: 15000,
      address: {
        recipientName: 'Ahmad Faisal',
        phone: '087812903487',
        addressLine: 'Jl. Malioboro No. 99',
        subdistrict: 'Danurejan',
        city: 'Kota Yogyakarta',
        province: 'DI Yogyakarta',
        postalCode: '55213'
      }
    },
    payment: {
      method: 'bank_transfer',
      bankName: 'BCA',
      status: 'failed'
    },
    timeline: [
      { id: 'tl-12', title: 'Pesanan Dibuat', timestamp: '2026-09-10T10:00:00Z', status: 'pending_payment', actor: 'customer' },
      { id: 'tl-13', title: 'Pesanan Dibatalkan', description: 'Batas waktu pembayaran telah berakhir (24 jam)', timestamp: '2026-09-11T10:01:00Z', status: 'cancelled', actor: 'system' }
    ],
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-11T10:01:00Z'
  }
]
