import { ref } from 'vue'
import { shippingAdapter } from '@/adapters/shipping'
import type { ShippingCourierService, ShippingRateCalculationParams } from '@/types'

export function useShipping() {
  const isLoading = ref(false)
  const availableServices = ref<ShippingCourierService[]>([])
  const error = ref<string | null>(null)

  async function fetchShippingRates(params: ShippingRateCalculationParams): Promise<ShippingCourierService[]> {
    isLoading.value = true
    error.value = null
    try {
      const services = await shippingAdapter.calculateRates(params)
      availableServices.value = services
      return services
    } catch (err: any) {
      error.value = err.message || 'Gagal menghitung tarif pengiriman'
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    availableServices,
    error,
    fetchShippingRates,
  }
}
