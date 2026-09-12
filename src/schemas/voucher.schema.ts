import { z } from 'zod'

export const voucherSchema = z.object({
  code: z.string().min(3, 'Kode voucher minimal 3 karakter').toUpperCase(),
  title: z.string().min(3, 'Judul voucher minimal 3 karakter'),
  description: z.string().optional(),
  discountType: z.enum(['fixed', 'percentage']),
  discountValue: z.number().min(1, 'Nilai diskon harus lebih dari 0'),
  maxDiscount: z.number().optional(),
  minOrderAmount: z.number().min(0, 'Minimal order minimal 0'),
  usageLimit: z.number().optional(),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  isActive: z.boolean().default(true),
})

export type VoucherFormData = z.infer<typeof voucherSchema>

export const flashSaleSchema = z.object({
  name: z.string().min(3, 'Nama event minimal 3 karakter'),
  startDate: z.string().min(1, 'Waktu mulai wajib diisi'),
  endDate: z.string().min(1, 'Waktu selesai wajib diisi'),
  isActive: z.boolean().default(true),
  showOnHome: z.boolean().default(true),
  productIds: z.array(z.string()).min(1, 'Pilih minimal 1 produk untuk flash sale'),
})

export type FlashSaleFormData = z.infer<typeof flashSaleSchema>
