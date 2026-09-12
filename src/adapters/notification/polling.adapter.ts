import type { NotificationAdapter, AppNotificationItem } from './adapter.interface'

/**
 * Polling Notification Adapter (Default)
 * Memeriksa notifikasi secara berkala (interval 30 detik) tanpa WebSocket server
 */
export class PollingNotificationAdapter implements NotificationAdapter {
  private timer: any = null
  private intervalMs: number
  private listeners: ((notifications: AppNotificationItem[]) => void)[] = []

  constructor(intervalSeconds = 30) {
    this.intervalMs = intervalSeconds * 1000
  }

  startListening(callback: (notifications: AppNotificationItem[]) => void): void {
    this.listeners.push(callback)
    if (!this.timer) {
      this.fetchNotifications()
      this.timer = setInterval(() => this.fetchNotifications(), this.intervalMs)
    }
  }

  stopListening(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.listeners = []
  }

  async markAsRead(notificationId: string): Promise<void> {
    // Implementasi mark as read
    console.log(`[Notification] Marked as read: ${notificationId}`)
  }

  private async fetchNotifications() {
    // Default initial mock notification data
    const mockNotifications: AppNotificationItem[] = [
      {
        id: 'notif-1',
        title: 'Pesanan Baru Masuk',
        message: 'Order #ORD-202609-001 dari Jessica menunggu konfirmasi pembayaran',
        type: 'order',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        link: '/admin/orders/ord-1'
      },
      {
        id: 'notif-2',
        title: 'Peringatan Stok Kritis',
        message: 'Produk "Kemeja Linen Oversize (Sage, L)" tersisa 2 pcs!',
        type: 'stock',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        link: '/admin/products'
      }
    ]

    for (const listener of this.listeners) {
      listener(mockNotifications)
    }
  }
}
