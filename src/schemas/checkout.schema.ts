import { z } from 'zod'

export const addressSchema = z.object({
  recipientName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  phone: z.string().min(9, 'Nomor HP minimal 9 digit').regex(/^[0-9+]+$/, 'Nomor HP hanya boleh berisi angka'),
  province: z.string().min(1, 'Provinsi wajib dipilih'),
  city: z.string().min(1, 'Kota/Kabupaten wajib dipilih'),
  subdistrict: z.string().min(1, 'Kecamatan wajib dipilih'),
  postalCode: z.string().min(5, 'Kode pos harus 5 digit').max(5, 'Kode pos harus 5 digit'),
  addressLine: z.string().min(10, 'Alamat lengkap minimal 10 karakter (nama jalan, RT/RW, nomor rumah)'),
  notes: z.string().max(200, 'Catatan maksimal 200 karakter').optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>

export const checkoutSchema = z.object({
  address: addressSchema,
  shippingCourierId: z.string().min(1, 'Pilih jasa pengiriman'),
  paymentMethodId: z.string().min(1, 'Pilih metode pembayaran'),
  voucherCode: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const paymentProofSchema = z.object({
  proofImage: z.string().min(1, 'Bukti transfer wajib diunggah'),
  bankSender: z.string().min(2, 'Nama bank pengirim wajib diisi'),
  accountHolder: z.string().min(2, 'Nama pemilik rekening pengirim wajib diisi'),
})

export type PaymentProofFormData = z.infer<typeof paymentProofSchema>
