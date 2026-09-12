// src/core/composables/useApi.ts
import { ref } from 'vue'
import { useAuthStore } from '@/core/stores/auth.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useToast } from '@/core/composables/useToast'
import appConfig from '@/app.config'
import axios, { type AxiosInstance } from 'axios'

export type ApiContext = 'admin' | 'customer'

// Base URL normalization
const rawBaseUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''
const baseURL = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, '')}/api`)
  : '/api'

function createApiClient(context: ApiContext): AxiosInstance {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  // Request interceptor — attach appropriate Bearer token
  instance.interceptors.request.use((config) => {
    if (context === 'admin') {
      const adminAuth = useAuthStore()
      if (adminAuth.token) {
        config.headers.Authorization = `Bearer ${adminAuth.token}`
      }
    } else {
      const customerAuth = useCustomerAuthStore()
      if (customerAuth.token) {
        config.headers.Authorization = `Bearer ${customerAuth.token}`
      }
    }
    return config
  })

  // Response interceptor — handle 401 based on context
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        if (context === 'admin') {
          const adminAuth = useAuthStore()
          adminAuth.clearAuth()
          window.location.href = appConfig.auth.loginRoute || '/admin/login'
        } else {
          const customerAuth = useCustomerAuthStore()
          customerAuth.logout()
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )

  return instance
}

export const adminApi = createApiClient('admin')
export const customerApi = createApiClient('customer')

// Default backward compatibility
export const api = adminApi

/**
 * Composable for making API requests with automatic auth headers,
 * error handling, and loading state.
 *
 * @param context 'admin' | 'customer' (default: 'admin')
 *
 * @example
 * const { get, post } = useApi('admin')
 * const products = await get('/products')
 *
 * const { get: getOrders } = useApi('customer')
 * const myOrders = await getOrders('/account/orders')
 */
export function useApi(context: ApiContext = 'admin') {
  const toast = useToast()
  const isLoading = ref(false)
  const client = context === 'customer' ? customerApi : adminApi

  async function request<T>(fn: () => Promise<T>): Promise<T | null> {
    isLoading.value = true
    try {
      return await fn()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? error.message
        toast.error(message, 'Request Failed')
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function get<T>(url: string, params?: Record<string, unknown>) {
    return request<T>(() => client.get<T>(url, { params }).then(r => r.data))
  }

  async function post<T>(url: string, data?: unknown) {
    return request<T>(() => client.post<T>(url, data).then(r => r.data))
  }

  async function put<T>(url: string, data?: unknown) {
    return request<T>(() => client.put<T>(url, data).then(r => r.data))
  }

  async function patch<T>(url: string, data?: unknown) {
    return request<T>(() => client.patch<T>(url, data).then(r => r.data))
  }

  async function del<T>(url: string) {
    return request<T>(() => client.delete<T>(url).then(r => r.data))
  }

  return { isLoading, get, post, put, patch, delete: del }
}

export const useAdminApi = () => useApi('admin')
export const useCustomerApi = () => useApi('customer')
