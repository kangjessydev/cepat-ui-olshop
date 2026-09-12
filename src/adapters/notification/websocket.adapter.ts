import type { NotificationAdapter, AppNotificationItem } from './adapter.interface'

/**
 * WebSocket Notification Adapter (Production Template)
 * Siap dikoneksikan ke Laravel Reverb, Pusher, atau Supabase Realtime
 */
export class WebSocketNotificationAdapter implements NotificationAdapter {
  private socket: WebSocket | null = null
  private wsUrl: string

  constructor(wsUrl?: string) {
    this.wsUrl = wsUrl || import.meta.env.VITE_WS_URL || 'wss://echo.websocket.org'
  }

  startListening(callback: (notifications: AppNotificationItem[]) => void): void {
    try {
      this.socket = new WebSocket(this.wsUrl)
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (Array.isArray(data)) {
            callback(data)
          } else if (data && data.title) {
            callback([data])
          }
        } catch (e) {
          console.error('[WebSocket] Failed to parse message', e)
        }
      }
    } catch (err) {
      console.error('[WebSocket] Connection failed', err)
    }
  }

  stopListening(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: 'markAsRead', id: notificationId }))
    }
  }
}
