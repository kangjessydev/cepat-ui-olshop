import type { PaymentAdapter } from './adapter.interface'
import { ManualPaymentAdapter } from './manual.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './xendit.adapter'

export const paymentAdapter: PaymentAdapter = new ManualPaymentAdapter()
