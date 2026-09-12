import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter').max(150, 'Nama produk maksimal 150 karakter'),
  slug: z.string().min(2, 'Slug wajib diisi'),
  sku: z.string().min(2, 'SKU produk wajib diisi'),
  categoryId: z.string().min(1, 'Kategori produk wajib dipilih'),
  description: z.string().min(10, 'Deskripsi produk minimal 10 karakter'),
  shortDescription: z.string().max(250, 'Deskripsi singkat maksimal 250 karakter').optional(),
  price: z.number().min(500, 'Harga minimal Rp 500'),
  originalPrice: z.number().optional(),
  stock: z.number().min(0, 'Stok minimal 0'),
  weight: z.number().min(1, 'Berat produk minimal 1 gram'),
  images: z.array(z.string()).min(1, 'Upload minimal 1 foto produk'),
  status: z.enum(['active', 'out_of_stock', 'draft', 'archived']).default('active'),
  hasVariants: z.boolean().default(false),
})

export type ProductFormData = z.infer<typeof productSchema>
