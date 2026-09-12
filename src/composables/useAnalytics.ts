/**
 * useAnalytics Composable
 *
 * Lightweight e-commerce analytics helper supporting Google Analytics 4 (GA4)
 * and Plausible Analytics with zero mandatory external runtime dependencies.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void
  }
}

export interface AnalyticsEventProps {
  [key: string]: string | number | boolean | undefined | null
}

export function useAnalytics() {
  const isEnabled = !import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_DEBUG === 'true'

  /**
   * Track general custom event
   */
  const trackEvent = (eventName: string, props: AnalyticsEventProps = {}) => {
    if (!isEnabled) {
      if (import.meta.env.DEV) {
        console.debug(`[Analytics Event] ${eventName}:`, props)
      }
      return
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, props)
    }

    // Plausible
    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
      window.plausible(eventName, { props })
    }
  }

  /**
   * Track page view
   */
  const trackPageView = (path: string, title?: string) => {
    trackEvent('page_view', {
      page_path: path,
      page_title: title || document.title
    })
  }

  /**
   * Track e-commerce: View Item
   */
  const trackViewItem = (item: { id: string; name: string; price: number; category?: string }) => {
    trackEvent('view_item', {
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      item_category: item.category || 'General',
      currency: 'IDR'
    })
  }

  /**
   * Track e-commerce: Add to Cart
   */
  const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    trackEvent('add_to_cart', {
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      value: item.price * item.quantity,
      currency: 'IDR'
    })
  }

  /**
   * Track e-commerce: Remove from Cart
   */
  const trackRemoveFromCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    trackEvent('remove_from_cart', {
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      currency: 'IDR'
    })
  }

  /**
   * Track e-commerce: Begin Checkout
   */
  const trackBeginCheckout = (itemsCount: number, totalAmount: number) => {
    trackEvent('begin_checkout', {
      items_count: itemsCount,
      value: totalAmount,
      currency: 'IDR'
    })
  }

  /**
   * Track e-commerce: Purchase
   */
  const trackPurchase = (order: {
    id: string
    totalAmount: number
    shippingCost: number
    discountAmount: number
    itemsCount: number
  }) => {
    trackEvent('purchase', {
      transaction_id: order.id,
      value: order.totalAmount,
      shipping: order.shippingCost,
      discount: order.discountAmount,
      items_count: order.itemsCount,
      currency: 'IDR'
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackViewItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase
  }
}
