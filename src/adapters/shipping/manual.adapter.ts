import type { ShippingAdapter } from './adapter.interface'
import type { ShippingCourierService, ShippingRateCalculationParams } from '@/types'

/**
 * Manual Shipping Adapter (Default)
 * Menghitung ongkir berdasarkan tarif flat per kg tanpa API eksternal
 */
export class ManualShippingAdapter implements ShippingAdapter {
  private baseRates: Omit<ShippingCourierService, 'cost'>[] = [
    {
      id: 'jne-reg',
      code: 'reg',
      courierName: 'JNE',
      name: 'JNE Regular',
      estimatedDays: '2 - 3 Hari',
      description: 'Layanan standar ke seluruh Indonesia'
    },
    {
      id: 'jnt-ez',
      code: 'ez',
      courierName: 'J&T',
      name: 'J&T EZ',
      estimatedDays: '1 - 2 Hari',
      description: 'Pengiriman cepat setiap hari tanpa libur'
    },
    {
      id: 'sicepat-best',
      code: 'best',
      courierName: 'SiCepat',
      name: 'SiCepat BEST',
      estimatedDays: '1 Hari',
      description: 'Besok Sampai Tujuan'
    },
    {
      id: 'instant',
      code: 'instant',
      courierName: 'Gojek / Grab',
      name: 'Instant / Same Day',
      estimatedDays: '3 - 6 Jam',
      description: 'Pengiriman kilat dalam kota yang sama'
    }
  ]

  async calculateRates(params: ShippingRateCalculationParams): Promise<ShippingCourierService[]> {
    const weightKg = Math.max(1, Math.ceil(params.totalWeightGrams / 1000))

    // Simulasi tarif per kg
    const rates: Record<string, number> = {
      'jne-reg': 12000,
      'jnt-ez': 14000,
      'sicepat-best': 19000,
      'instant': 25000
    }

    return this.baseRates.map(courier => ({
      ...courier,
      cost: (rates[courier.id] || 15000) * weightKg
    }))
  }
}
