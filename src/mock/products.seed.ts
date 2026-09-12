import type { Product, ProductCategory } from '@/types'

export const categoriesSeed: ProductCategory[] = [
  { id: 'cat-fashion-pria', name: 'Fashion Pria', slug: 'fashion-pria', icon: 'Shirt' },
  { id: 'cat-fashion-wanita', name: 'Fashion Wanita', slug: 'fashion-wanita', icon: 'Sparkles' },
  { id: 'cat-elektronik', name: 'Elektronik & Gadget', slug: 'elektronik-gadget', icon: 'Smartphone' },
  { id: 'cat-aksesoris', name: 'Tas & Aksesoris', slug: 'tas-aksesoris', icon: 'Watch' },
  { id: 'cat-lifestyle', name: 'Rumah & Gaya Hidup', slug: 'rumah-gaya-hidup', icon: 'Coffee' },
  { id: 'cat-sepatu', name: 'Sepatu & Sneakers', slug: 'sepatu-sneakers', icon: 'Footprints' },
]

export const productsSeed: Product[] = [
  {
    id: 'prod-1',
    name: 'Kemeja Linen Oversized Relaxed Fit',
    slug: 'kemeja-linen-oversized-relaxed-fit',
    sku: 'LNN-OVS-001',
    description: 'Kemeja kasual berbahan 100% French Linen premium. Ringan, adem, dan memiliki sirkulasi udara optimal untuk iklim tropis. Potongan relaxed fit modern yang nyaman dipakai seharian.',
    shortDescription: '100% French linen premium dengan potongan modern relaxed fit.',
    price: 249000,
    originalPrice: 329000,
    discountPercent: 24,
    stock: 45,
    category: categoriesSeed[0],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 350,
    rating: 4.8,
    reviewCount: 42,
    soldCount: 184,
    hasVariants: true,
    variantTypes: [
      { id: 'v-warna', name: 'Warna', options: ['Sage Green', 'Off White', 'Navy Blue'] },
      { id: 'v-ukuran', name: 'Ukuran', options: ['M', 'L', 'XL'] }
    ],
    variantMatrix: [
      { id: 'vm-1', combination: { Warna: 'Sage Green', Ukuran: 'M' }, price: 249000, stock: 8, sku: 'LNN-SGE-M' },
      { id: 'vm-2', combination: { Warna: 'Sage Green', Ukuran: 'L' }, price: 249000, stock: 2, sku: 'LNN-SGE-L' },
      { id: 'vm-3', combination: { Warna: 'Sage Green', Ukuran: 'XL' }, price: 249000, stock: 5, sku: 'LNN-SGE-XL' },
      { id: 'vm-4', combination: { Warna: 'Off White', Ukuran: 'M' }, price: 249000, stock: 12, sku: 'LNN-WHT-M' },
      { id: 'vm-5', combination: { Warna: 'Off White', Ukuran: 'L' }, price: 249000, stock: 9, sku: 'LNN-WHT-L' },
      { id: 'vm-6', combination: { Warna: 'Off White', Ukuran: 'XL' }, price: 249000, stock: 4, sku: 'LNN-WHT-XL' },
      { id: 'vm-7', combination: { Warna: 'Navy Blue', Ukuran: 'M' }, price: 249000, stock: 0, sku: 'LNN-NVY-M' },
      { id: 'vm-8', combination: { Warna: 'Navy Blue', Ukuran: 'L' }, price: 249000, stock: 3, sku: 'LNN-NVY-L' },
      { id: 'vm-9', combination: { Warna: 'Navy Blue', Ukuran: 'XL' }, price: 249000, stock: 2, sku: 'LNN-NVY-XL' },
    ],
    createdAt: '2026-08-15T08:00:00Z',
    updatedAt: '2026-09-10T11:20:00Z'
  },
  {
    id: 'prod-2',
    name: 'Smartwatch AMOLED Ultra Thin Titanium Case',
    slug: 'smartwatch-amoled-ultra-thin-titanium-case',
    sku: 'SMW-TIT-002',
    description: 'Smartwatch layar AMOLED 1.43 inci dengan bezel titanium tahan gores. Dilengkapi sensor detak jantung 24/7, SpO2, GPS independen, dan baterai tahan hingga 14 hari pemakaian.',
    shortDescription: 'Layar AMOLED 1.43", bodi titanium, GPS, baterai 14 hari.',
    price: 899000,
    originalPrice: 1250000,
    discountPercent: 28,
    stock: 28,
    category: categoriesSeed[2],
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 220,
    rating: 4.9,
    reviewCount: 68,
    soldCount: 310,
    hasVariants: true,
    variantTypes: [
      { id: 'v-warna-strap', name: 'Tali Jam', options: ['Black Fluororubber', 'Leather Brown'] }
    ],
    variantMatrix: [
      { id: 'vm-sw-1', combination: { 'Tali Jam': 'Black Fluororubber' }, price: 899000, stock: 18, sku: 'SMW-TIT-BLK' },
      { id: 'vm-sw-2', combination: { 'Tali Jam': 'Leather Brown' }, price: 949000, stock: 10, sku: 'SMW-TIT-BRN' },
    ],
    createdAt: '2026-07-20T04:30:00Z',
    updatedAt: '2026-09-11T09:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Tas Ransel Kanvas Anti-Air Urban Commuter',
    slug: 'tas-ransel-kanvas-anti-air-urban-commuter',
    sku: 'BPK-URB-003',
    description: 'Ransel laptop 15.6 inch berbahan kanvas bicoating tahan air. Dilengkapi slot laptop busa memori, port USB eksternal, kompartemen botol tersembunyi, dan strap dada ergonomis.',
    shortDescription: 'Kompartemen laptop 15.6", tahan air, stylish untuk kerja & kuliah.',
    price: 389000,
    originalPrice: 450000,
    discountPercent: 14,
    stock: 35,
    category: categoriesSeed[3],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 650,
    rating: 4.7,
    reviewCount: 31,
    soldCount: 95,
    hasVariants: true,
    variantTypes: [
      { id: 'v-bag-color', name: 'Warna', options: ['Charcoal Grey', 'Olive Green', 'Classic Black'] }
    ],
    variantMatrix: [
      { id: 'vm-bp-1', combination: { Warna: 'Charcoal Grey' }, price: 389000, stock: 15, sku: 'BPK-URB-GRY' },
      { id: 'vm-bp-2', combination: { Warna: 'Olive Green' }, price: 389000, stock: 8, sku: 'BPK-URB-OLV' },
      { id: 'vm-bp-3', combination: { Warna: 'Classic Black' }, price: 389000, stock: 12, sku: 'BPK-URB-BLK' },
    ],
    createdAt: '2026-08-01T10:15:00Z',
    updatedAt: '2026-09-08T14:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'Wireless Earbuds TWS ANC Active Noise Cancelling',
    slug: 'wireless-earbuds-tws-anc-active-noise-cancelling',
    sku: 'TWS-ANC-004',
    description: 'Earbuds nirkabel Bluetooth 5.4 dengan peredam bising aktif hingga 42dB. Driver dinamis 12mm menghasilkan bass bertenaga dan vokal jernih. Latensi rendah 45ms cocok untuk gaming.',
    shortDescription: 'Hybrid ANC 42dB, Bluetooth 5.4, 32 jam total playtime.',
    price: 349000,
    originalPrice: 499000,
    discountPercent: 30,
    stock: 50,
    category: categoriesSeed[2],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 180,
    rating: 4.8,
    reviewCount: 112,
    soldCount: 420,
    hasVariants: true,
    variantTypes: [
      { id: 'v-tws-color', name: 'Warna', options: ['Matte Black', 'Pearl White'] }
    ],
    variantMatrix: [
      { id: 'vm-tws-1', combination: { Warna: 'Matte Black' }, price: 349000, stock: 30, sku: 'TWS-ANC-BLK' },
      { id: 'vm-tws-2', combination: { Warna: 'Pearl White' }, price: 349000, stock: 20, sku: 'TWS-ANC-WHT' },
    ],
    createdAt: '2026-06-11T09:00:00Z',
    updatedAt: '2026-09-12T02:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Sepatu Sneaker Retro Running Classic White',
    slug: 'sepatu-sneaker-retro-running-classic-white',
    sku: 'SNK-RTR-005',
    description: 'Sneakers dengan siluet retro 90-an berbahan kombinasi suede dan breathable mesh. Outsole karet waffle antiselip dengan insole busa empuk untuk pemakaian harian santai.',
    shortDescription: 'Desain retro estetik, insole empuk, outsole karet waffle antiselip.',
    price: 459000,
    originalPrice: 599000,
    discountPercent: 23,
    stock: 24,
    category: categoriesSeed[5],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 850,
    rating: 4.9,
    reviewCount: 54,
    soldCount: 175,
    hasVariants: true,
    variantTypes: [
      { id: 'v-size', name: 'Ukuran', options: ['40', '41', '42', '43'] }
    ],
    variantMatrix: [
      { id: 'vm-snk-40', combination: { Ukuran: '40' }, price: 459000, stock: 4, sku: 'SNK-WHT-40' },
      { id: 'vm-snk-41', combination: { Ukuran: '41' }, price: 459000, stock: 8, sku: 'SNK-WHT-41' },
      { id: 'vm-snk-42', combination: { Ukuran: '42' }, price: 459000, stock: 10, sku: 'SNK-WHT-42' },
      { id: 'vm-snk-43', combination: { Ukuran: '43' }, price: 459000, stock: 2, sku: 'SNK-WHT-43' },
    ],
    createdAt: '2026-07-18T13:00:00Z',
    updatedAt: '2026-09-05T08:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Tumbler Stainless Steel Double Wall 600ml',
    slug: 'tumbler-stainless-steel-double-wall-600ml',
    sku: 'TMB-SS-006',
    description: 'Botol minum vakum terisolasi tahan panas 12 jam dan dingin hingga 24 jam. Food grade stainless steel 304 bebas BPA dengan tutup anti-bocor berhandle silikon.',
    shortDescription: 'Tahan panas 12 jam & dingin 24 jam, SUS 304, leak-proof lid.',
    price: 139000,
    originalPrice: 179000,
    discountPercent: 22,
    stock: 65,
    category: categoriesSeed[4],
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 380,
    rating: 4.8,
    reviewCount: 88,
    soldCount: 390,
    hasVariants: true,
    variantTypes: [
      { id: 'v-tmb-color', name: 'Warna', options: ['Matte Black', 'Sage Green', 'Lilac Cream'] }
    ],
    variantMatrix: [
      { id: 'vm-tmb-1', combination: { Warna: 'Matte Black' }, price: 139000, stock: 25, sku: 'TMB-600-BLK' },
      { id: 'vm-tmb-2', combination: { Warna: 'Sage Green' }, price: 139000, stock: 22, sku: 'TMB-600-SGE' },
      { id: 'vm-tmb-3', combination: { Warna: 'Lilac Cream' }, price: 139000, stock: 18, sku: 'TMB-600-LLC' },
    ],
    createdAt: '2026-08-10T07:20:00Z',
    updatedAt: '2026-09-09T10:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Biji Kopi Arabika Gayo Single Origin 250g',
    slug: 'biji-kopi-arabika-gayo-single-origin-250g',
    sku: 'COF-GYO-007',
    description: 'Biji kopi pilihan dari dataran tinggi Aceh Gayo (1500 mdpl). Profil rasa: brown sugar, black tea, dan sentuhan citrus segar. Dipanggang profil medium roast oleh roaster bersertifikat.',
    shortDescription: '100% Arabika Gayo Aceh, medium roast, fresh roasted aroma.',
    price: 85000,
    originalPrice: 105000,
    discountPercent: 19,
    stock: 40,
    category: categoriesSeed[4],
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 270,
    rating: 4.9,
    reviewCount: 94,
    soldCount: 512,
    hasVariants: true,
    variantTypes: [
      { id: 'v-grind', name: 'Gilingan', options: ['Biji Utuh', 'Giling Halus (Espresso)', 'Giling Sedang (V60)', 'Giling Kasar (French Press)'] }
    ],
    variantMatrix: [
      { id: 'vm-cof-1', combination: { Gilingan: 'Biji Utuh' }, price: 85000, stock: 15, sku: 'COF-GYO-WHL' },
      { id: 'vm-cof-2', combination: { Gilingan: 'Giling Halus (Espresso)' }, price: 85000, stock: 10, sku: 'COF-GYO-FLN' },
      { id: 'vm-cof-3', combination: { Gilingan: 'Giling Sedang (V60)' }, price: 85000, stock: 10, sku: 'COF-GYO-MED' },
      { id: 'vm-cof-4', combination: { Gilingan: 'Giling Kasar (French Press)' }, price: 85000, stock: 5, sku: 'COF-GYO-CSR' },
    ],
    createdAt: '2026-08-25T05:00:00Z',
    updatedAt: '2026-09-12T01:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Kacamata Hitam Polarized Frame Acetate Retro',
    slug: 'kacamata-hitam-polarized-frame-acetate-retro',
    sku: 'SGL-POL-008',
    description: 'Lensa polarized UV400 yang memblokir silau 100%. Frame dari material bio-acetate ringan yang kuat dan nyaman dipakai berjam-jam saat berkendara maupun liburan.',
    shortDescription: 'Lensa UV400 polarized, frame bio-acetate premium tahan lama.',
    price: 189000,
    originalPrice: 249000,
    discountPercent: 24,
    stock: 20,
    category: categoriesSeed[3],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 150,
    rating: 4.7,
    reviewCount: 29,
    soldCount: 88,
    hasVariants: false,
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'prod-9',
    name: 'Celana Panjang Chino Slim-Fit Stretch',
    slug: 'celana-panjang-chino-slim-fit-stretch',
    sku: 'CHN-SLM-009',
    description: 'Chino berbahan katun twill elastis dengan teknologi stretch 4-way. Sangat fleksibel untuk aktivitas kantor formal hingga nongkrong santai.',
    shortDescription: 'Katun twill stretch 4-way, fleksibel, potongan rapi slim fit.',
    price: 219000,
    originalPrice: 289000,
    discountPercent: 24,
    stock: 3, // Stok Kritis untuk demonstrasi dashboard!
    category: categoriesSeed[0],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 480,
    rating: 4.6,
    reviewCount: 52,
    soldCount: 220,
    hasVariants: true,
    variantTypes: [
      { id: 'v-chn-color', name: 'Warna', options: ['Khaki', 'Dark Charcoal'] }
    ],
    variantMatrix: [
      { id: 'vm-chn-1', combination: { Warna: 'Khaki' }, price: 219000, stock: 2, sku: 'CHN-KHK-32' },
      { id: 'vm-chn-2', combination: { Warna: 'Dark Charcoal' }, price: 219000, stock: 1, sku: 'CHN-CHR-32' },
    ],
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-09-12T03:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'GaN Fast Charger 65W 3-Port Type-C & USB-A',
    slug: 'gan-fast-charger-65w-3-port-type-c-and-usb-a',
    sku: 'CHG-GAN-010',
    description: 'Kepala charger berukuran mini menggunakan semikonduktor Gallium Nitride (GaN). Mampu mengisi daya laptop Macbook/Thinkpad, iPad, dan smartphone sekaligus dengan daya maksimal 65W.',
    shortDescription: 'Teknologi GaN 65W, 2x USB-C + 1x USB-A, mini & tidak panas.',
    price: 199000,
    originalPrice: 299000,
    discountPercent: 33,
    stock: 32,
    category: categoriesSeed[2],
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 200,
    rating: 4.9,
    reviewCount: 78,
    soldCount: 340,
    hasVariants: false,
    createdAt: '2026-08-04T12:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'Dress Casual Midi Floral A-Line Katun Rayon',
    slug: 'dress-casual-midi-floral-a-line-katun-rayon',
    sku: 'DRS-FLR-011',
    description: 'Dress wanita dengan motif bunga floral lembut berbahan rayon viscose yang jatuh dan sangat adem. Kerah V-neck anggun dengan tali serut pinggang yang mempercantik siluet tubuh.',
    shortDescription: 'Rayon viscose lembut dan flowy, aksen kerut pinggang feminin.',
    price: 189000,
    originalPrice: 259000,
    discountPercent: 27,
    stock: 18,
    category: categoriesSeed[1],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 310,
    rating: 4.8,
    reviewCount: 36,
    soldCount: 140,
    hasVariants: false,
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-09-04T15:00:00Z'
  },
  {
    id: 'prod-12',
    name: 'Dompet Pria Kulit Asli Bifold RFID Blocking',
    slug: 'dompet-pria-kulit-asli-bifold-rfid-blocking',
    sku: 'WLT-LTR-012',
    description: 'Dompet bifold pria dari 100% kulit sapi asli top grain bergaransi. Dilengkapi lapisan pelindung anti-maling digital RFID blocking untuk mengamankan data kartu kredit dan ATM.',
    shortDescription: '100% Genuine leather, proteksi anti-skimming RFID, 8 slot kartu.',
    price: 159000,
    originalPrice: 220000,
    discountPercent: 28,
    stock: 2, // Stok Kritis untuk demonstrasi!
    category: categoriesSeed[3],
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    weight: 160,
    rating: 4.8,
    reviewCount: 44,
    soldCount: 195,
    hasVariants: false,
    createdAt: '2026-07-28T08:00:00Z',
    updatedAt: '2026-09-11T13:00:00Z'
  }
]
