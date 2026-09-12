import { defineStore } from 'pinia'
import { useNotification } from '@/composables/useNotification'

export const useNotificationStore = defineStore('notification', () => {
  const { notifications, unreadCount, start, stop, markAsRead } = useNotification()

  return {
    notifications,
    unreadCount,
    start,
    stop,
    markAsRead
  }
})
