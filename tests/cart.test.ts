import { describe, it, expect } from 'vitest'
import type { OrderItem, Voucher } from '../src/types'

function calculateCartTotals(items: OrderItem[], voucher: Voucher | null = null, shippingCost: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 0)

  let discountAmount = 0
  if (voucher && subtotal >= voucher.minOrderAmount) {
    if (voucher.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, voucher.discountValue)
    } else {
      const calculated = (subtotal * voucher.discountValue) / 100
      discountAmount = voucher.maxDiscount ? Math.min(calculated, voucher.maxDiscount) : calculated
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost)

  return {
    subtotal,
    totalItemsCount,
    totalWeight,
    discountAmount,
    grandTotal
  }
}

describe('Cart Calculations', () => {
  const mockItems: OrderItem[] = [
    {
      id: 'item-1',
      productId: 'prod-1',
      productName: 'Kemeja Katun',
      productImage: 'https://placehold.co/100',
      price: 150000,
      quantity: 2,
      subtotal: 300000,
      weight: 300
    },
    {
      id: 'item-2',
      productId: 'prod-2',
      productName: 'Celana Chino',
      productImage: 'https://placehold.co/100',
      price: 200000,
      quantity: 1,
      subtotal: 200000,
      weight: 400
    }
  ]

  it('calculates correct subtotal, total items, and total weight without voucher', () => {
    const result = calculateCartTotals(mockItems, null, 15000)

    expect(result.subtotal).toBe(500000)
    expect(result.totalItemsCount).toBe(3)
    expect(result.totalWeight).toBe(1000)
    expect(result.discountAmount).toBe(0)
    expect(result.grandTotal).toBe(515000)
  })

  it('applies percentage voucher with maxDiscount cap', () => {
    const voucher: Voucher = {
      id: 'v-1',
      code: 'DISKON20',
      title: 'Diskon 20%',
      discountType: 'percentage',
      discountValue: 20, // 20% of 500,000 = 100,000
      maxDiscount: 50000, // capped at 50,000
      minOrderAmount: 200000,
      quota: 100,
      usedCount: 10,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true
    }

    const result = calculateCartTotals(mockItems, voucher, 0)
    expect(result.discountAmount).toBe(50000)
    expect(result.grandTotal).toBe(450000)
  })

  it('applies fixed discount voucher correctly', () => {
    const voucher: Voucher = {
      id: 'v-2',
      code: 'HEMAT25RB',
      title: 'Hemat 25 Ribu',
      discountType: 'fixed',
      discountValue: 25000,
      minOrderAmount: 100000,
      quota: 50,
      usedCount: 5,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true
    }

    const result = calculateCartTotals(mockItems, voucher, 12000)
    expect(result.discountAmount).toBe(25000)
    expect(result.grandTotal).toBe(487000)
  })

  it('ignores voucher if subtotal is below minOrderAmount', () => {
    const singleItem: OrderItem[] = [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Kaos Polos',
        productImage: 'https://placehold.co/100',
        price: 75000,
        quantity: 1,
        subtotal: 75000,
        weight: 150
      }
    ]

    const voucher: Voucher = {
      id: 'v-3',
      code: 'BIGSPENDER',
      title: 'Diskon Belanja Banyak',
      discountType: 'fixed',
      discountValue: 50000,
      minOrderAmount: 200000,
      quota: 50,
      usedCount: 0,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      isActive: true
    }

    const result = calculateCartTotals(singleItem, voucher, 10000)
    expect(result.subtotal).toBe(75000)
    expect(result.discountAmount).toBe(0)
    expect(result.grandTotal).toBe(85000)
  })
})
