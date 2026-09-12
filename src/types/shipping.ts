export interface ShippingCourierService {
  id: string
  code: string // misal: "reg", "oke", "cargo"
  name: string // "Layanan Reguler"
  courierName: string // "JNE", "J&T", "SiCepat"
  cost: number
  estimatedDays: string // "2-3 Hari"
  description?: string
}

export interface ShippingRateCalculationParams {
  destinationProvince: string
  destinationCity: string
  destinationSubdistrict?: string
  totalWeightGrams: number
  totalPrice?: number
}
