import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Customer, CustomerAddress } from '@/types'

const CUSTOMER_STORAGE_KEY = 'cepat_olshop_customer'

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const customer = ref<Customer | null>(loadCustomerFromStorage())
  const token = ref<string | null>(localStorage.getItem('cepat_olshop_customer_token'))

  function loadCustomerFromStorage(): Customer | null {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  const isAuthenticated = computed(() => !!customer.value)

  function login(customerData: Customer, authToken = 'mock_cust_token_123') {
    customer.value = customerData
    token.value = authToken
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerData))
    localStorage.setItem('cepat_olshop_customer_token', authToken)
  }

  function register(data: { name: string; email: string; phone: string }) {
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      totalOrders: 0,
      totalSpent: 0,
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    login(newCustomer)
    return newCustomer
  }

  function logout() {
    customer.value = null
    token.value = null
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
    localStorage.removeItem('cepat_olshop_customer_token')
  }

  function updateProfile(updated: Partial<Customer>) {
    if (!customer.value) return
    customer.value = { ...customer.value, ...updated, updatedAt: new Date().toISOString() }
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer.value))
  }

  function addAddress(address: CustomerAddress) {
    if (!customer.value) return
    customer.value.addresses.push(address)
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer.value))
  }

  function removeAddress(index: number) {
    if (!customer.value) return
    customer.value.addresses.splice(index, 1)
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer.value))
  }

  return {
    customer,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    removeAddress
  }
})
