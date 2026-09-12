import type { ShippingAdapter } from './adapter.interface'
import { ManualShippingAdapter } from './manual.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './rajaongkir.adapter'

export const shippingAdapter: ShippingAdapter = new ManualShippingAdapter()
