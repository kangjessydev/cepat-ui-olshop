import type { NotificationAdapter } from './adapter.interface'
import { PollingNotificationAdapter } from './polling.adapter'

export * from './adapter.interface'
export * from './polling.adapter'
export * from './websocket.adapter'

export const notificationAdapter: NotificationAdapter = new PollingNotificationAdapter(30)
