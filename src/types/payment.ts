export interface BankAccount {
  id: string
  bankName: string // BCA, Mandiri, BNI, BRI
  accountNumber: string
  accountName: string
  bankLogo?: string
  instructions?: string[]
}

export interface PaymentMethodOption {
  id: string
  type: 'bank_transfer' | 'cod' | 'ewallet'
  name: string
  description?: string
  isEnabled: boolean
  bankAccounts?: BankAccount[]
}
