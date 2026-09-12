import { ref, computed } from 'vue'
import { notificationAdapter, type AppNotificationItem } from '@/adapters/notification'

export function useNotification() {
  const notifications = ref<AppNotificationItem[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function updateNotifications(items: AppNotificationItem[]) {
    notifications.value = items
  }

  function start() {
    notificationAdapter.startListening(updateNotifications)
  }

  function stop() {
    notificationAdapter.stopListening()
  }

  async function markAsRead(id: string) {
    await notificationAdapter.markAsRead(id)
    const item = notifications.value.find(n => n.id === id)
    if (item) {
      item.read = true
    }
  }

  return {
    notifications,
    unreadCount,
    start,
    stop,
    markAsRead
  }
}
