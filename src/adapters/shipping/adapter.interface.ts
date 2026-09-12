import type { ShippingCourierService, ShippingRateCalculationParams } from '@/types'

export interface ShippingAdapter {
  /**
   * Ambil daftar kurir & estimasi ongkir berdasarkan asal, tujuan, dan berat
   */
  calculateRates(params: ShippingRateCalculationParams): Promise<ShippingCourierService[]>

  /**
   * Cek status / lacak nomor resi
   */
  trackShipment?(courier: string, trackingNumber: string): Promise<any>
}
