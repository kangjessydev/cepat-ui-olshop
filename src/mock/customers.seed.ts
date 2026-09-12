import type { Customer } from '@/types'

export const customersSeed: Customer[] = [
  {
    id: 'cust-1',
    name: 'Jessica Aurelia',
    email: 'jessica.aurelia@gmail.com',
    phone: '081234567890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    totalOrders: 6,
    totalSpent: 1845000,
    addresses: [
      {
        recipientName: 'Jessica Aurelia',
        phone: '081234567890',
        addressLine: 'Jl. Surya Kencana No. 42, RT 03 / RW 05',
        subdistrict: 'Bogor Tengah',
        city: 'Kota Bogor',
        province: 'Jawa Barat',
        postalCode: '16123',
        notes: 'Pagar warna hitam, titip satpam jika tidak ada di rumah'
      }
    ],
    defaultAddressIndex: 0,
    createdAt: '2026-06-10T12:00:00Z',
    updatedAt: '2026-09-12T07:15:00Z'
  },
  {
    id: 'cust-2',
    name: 'Budi Santoso',
    email: 'budi.santoso@yahoo.com',
    phone: '082198765432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    totalOrders: 3,
    totalSpent: 2150000,
    addresses: [
      {
        recipientName: 'Budi Santoso',
        phone: '082198765432',
        addressLine: 'Ruko Puri Kencana Blok A No. 12',
        subdistrict: 'Kembangan',
        city: 'Jakarta Barat',
        province: 'DKI Jakarta',
        postalCode: '11610'
      }
    ],
    defaultAddressIndex: 0,
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-09-12T05:20:00Z'
  },
  {
    id: 'cust-3',
    name: 'Dimas Pratama',
    email: 'dimas.pratama@outlook.com',
    phone: '085712345678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    totalOrders: 4,
    totalSpent: 1620000,
    addresses: [
      {
        recipientName: 'Dimas Pratama',
        phone: '085712345678',
        addressLine: 'Jl. Dago Asri No. 17',
        subdistrict: 'Coblong',
        city: 'Kota Bandung',
        province: 'Jawa Barat',
        postalCode: '40135'
      }
    ],
    defaultAddressIndex: 0,
    createdAt: '2026-05-18T15:30:00Z',
    updatedAt: '2026-09-11T14:00:00Z'
  },
  {
    id: 'cust-4',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@gmail.com',
    phone: '081398712345',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    totalOrders: 2,
    totalSpent: 920000,
    addresses: [
      {
        recipientName: 'Siti Rahmawati',
        phone: '081398712345',
        addressLine: 'Komplek Griya Indah Blok C3 No. 8',
        subdistrict: 'Gayungan',
        city: 'Kota Surabaya',
        province: 'Jawa Timur',
        postalCode: '60235'
      }
    ],
    defaultAddressIndex: 0,
    createdAt: '2026-08-14T08:20:00Z',
    updatedAt: '2026-09-09T07:45:00Z'
  }
]
