/**
 * registerServiceWorker.ts
 *
 * Lightweight Service Worker registration helper for offline capabilities
 * and PWA installability.
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('[PWA] ServiceWorker registered with scope:', registration.scope)
        })
        .catch(error => {
          console.error('[PWA] ServiceWorker registration failed:', error)
        })
    })
  }
}
