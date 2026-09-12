import { describe, it, expect } from 'vitest'
import { ManualPaymentAdapter } from '../src/adapters/payment/manual.adapter'
import { XenditPaymentAdapter } from '../src/adapters/payment/xendit.adapter'

describe('Payment Adapters', () => {
  const sampleParams = {
    orderId: 'ord-test-1',
    orderNumber: 'ORD-202609-999',
    amount: 350000,
    customerName: 'Budi Santoso',
    customerEmail: 'budi@test.com',
    customerPhone: '08123456789',
    items: [],
    paymentMethodId: 'bank_transfer'
  }

  describe('ManualPaymentAdapter', () => {
    const adapter = new ManualPaymentAdapter()

    it('identifies as manual provider and is always configured', () => {
      expect(adapter.providerName).toBe('manual')
      expect(adapter.isConfigured()).toBe(true)
    })

    it('returns bank transfer and cod options', async () => {
      const methods = await adapter.getAvailableMethods()
      expect(methods.length).toBeGreaterThanOrEqual(2)
      expect(methods.some(m => m.id === 'bank_transfer')).toBe(true)
      expect(methods.some(m => m.id === 'cod')).toBe(true)
    })

    it('creates manual bank transfer with account instructions', async () => {
      const result = await adapter.createPayment(sampleParams)
      expect(result.success).toBe(true)
      expect(result.provider).toBe('manual')
      expect(result.bankName).toBe('BCA')
      expect(result.accountNumber).toBe('8830123456')
      expect(result.reference).toContain('MANUAL-ORD-202609-999')
      expect(result.instructions?.length).toBeGreaterThan(0)
    })

    it('handles COD payments properly', async () => {
      const result = await adapter.createPayment({
        ...sampleParams,
        paymentMethodId: 'cod'
      })
      expect(result.success).toBe(true)
      expect(result.reference).toContain('COD-')
      expect(result.status).toBe('pending')
    })
  })

  describe('XenditPaymentAdapter', () => {
    const adapter = new XenditPaymentAdapter()

    it('identifies as xendit provider', () => {
      expect(adapter.providerName).toBe('xendit')
    })

    it('lists modern payment options (QRIS, VA, Hosted Checkout)', async () => {
      const methods = await adapter.getAvailableMethods()
      expect(methods.some(m => m.id === 'xendit_qris')).toBe(true)
      expect(methods.some(m => m.id === 'xendit_va')).toBe(true)
      expect(methods.some(m => m.id === 'xendit_invoice')).toBe(true)
    })

    it('creates QRIS transaction with qr payload and checkout URL', async () => {
      const result = await adapter.createPayment({
        ...sampleParams,
        paymentMethodId: 'xendit_qris'
      })
      expect(result.success).toBe(true)
      expect(result.provider).toBe('xendit')
      expect(result.qrString).toBeDefined()
      expect(result.paymentUrl).toContain('xendit.co/web/')
    })

    it('creates Virtual Account transaction with generated VA number', async () => {
      const result = await adapter.createPayment({
        ...sampleParams,
        paymentMethodId: 'xendit_va'
      })
      expect(result.success).toBe(true)
      expect(result.accountNumber).toBeDefined()
      expect(result.accountNumber?.length).toBeGreaterThanOrEqual(10)
      expect(result.bankName).toContain('Virtual Account')
    })
  })
})
