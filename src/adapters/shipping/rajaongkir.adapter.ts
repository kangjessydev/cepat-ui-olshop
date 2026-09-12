import type { ShippingAdapter } from './adapter.interface'
import type { ShippingCourierService, ShippingRateCalculationParams } from '@/types'
import axios from 'axios'

/**
 * RajaOngkir Shipping Adapter (Production Template)
 */
export class RajaOngkirAdapter implements ShippingAdapter {
  private apiKey: string
  private originCityId: string

  constructor(apiKey?: string, originCityId?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_RAJAONGKIR_API_KEY || ''
    this.originCityId = originCityId || import.meta.env.VITE_ORIGIN_CITY_ID || '151' // Jakarta Barat default
  }

  async calculateRates(_params: ShippingRateCalculationParams): Promise<ShippingCourierService[]> {
    if (!this.apiKey) {
      throw new Error('RajaOngkir API Key belum diisi di .env (VITE_RAJAONGKIR_API_KEY)')
    }

    try {
      // Biasanya di-proxy via backend untuk menjaga API Key
      const response = await axios.post('/api/shipping/calculate', {
        origin: this.originCityId,
        destination: _params.destinationCity,
        weight: _params.totalWeightGrams,
        courier: 'jne:jnt:sicepat'
      })
      return response.data.results
    } catch (err: any) {
      console.error('RajaOngkir calculate error:', err)
      throw err
    }
  }
}
