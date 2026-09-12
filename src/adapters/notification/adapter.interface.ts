export interface AppNotificationItem {
  id: string
  title: string
  message: string
  type: 'order' | 'stock' | 'system'
  read: boolean
  createdAt: string
  link?: string
}

export interface NotificationAdapter {
  startListening(callback: (notifications: AppNotificationItem[]) => void): void
  stopListening(): void
  markAsRead(notificationId: string): Promise<void>
}
