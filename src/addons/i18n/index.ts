/**
 * i18n Addon
 *
 * Lightweight, zero-dependency localization composable supporting:
 * - ID and EN switching with localStorage persistence
 * - Nested translation key retrieval: t('home.flash_sale')
 * - Multi-currency formatting: IDR, USD, SGD
 */

import { ref, computed } from 'vue'
import idMessages from './id.json'
import enMessages from './en.json'

export type Locale = 'id' | 'en'

const currentLocale = ref<Locale>((localStorage.getItem('cepat_locale') as Locale) || 'id')

const messages: Record<Locale, any> = {
  id: idMessages,
  en: enMessages
}

export function useI18n() {
  const locale = computed(() => currentLocale.value)

  const setLocale = (newLocale: Locale) => {
    currentLocale.value = newLocale
    localStorage.setItem('cepat_locale', newLocale)
  }

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.')
    let result: any = messages[currentLocale.value]

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key]
      } else {
        return fallback || path
      }
    }

    return typeof result === 'string' ? result : (fallback || path)
  }

  const formatCurrency = (amount: number, currency = currentLocale.value === 'id' ? 'IDR' : 'USD'): string => {
    if (currency === 'IDR') {
      return `Rp ${amount.toLocaleString('id-ID')}`
    }
    return new Intl.NumberFormat(currentLocale.value === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  return {
    locale,
    setLocale,
    t,
    formatCurrency
  }
}
