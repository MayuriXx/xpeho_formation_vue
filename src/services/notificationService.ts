import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  timestamp: number
}

export interface InjectionKey {
  notificationService: typeof notificationService
}

const notifications = ref<Notification[]>([])
const logs = ref<Array<{ timestamp: number; message: string; type: NotificationType }>>([])

export const notificationService = {
  notifications,
  logs,

  add(message: string, type: NotificationType = 'info', duration: number = 3000) {
    const id = Date.now().toString()
    const timestamp = Date.now()

    // Ajouter la notification
    notifications.value.push({ id, message, type, timestamp })

    // Ajouter au log
    logs.value.push({ timestamp, message, type })

    // Retirer la notification après la durée
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  },

  success(message: string, duration?: number) {
    return this.add(message, 'success', duration)
  },

  error(message: string, duration?: number) {
    return this.add(message, 'error', duration)
  },

  warning(message: string, duration?: number) {
    return this.add(message, 'warning', duration)
  },

  info(message: string, duration?: number) {
    return this.add(message, 'info', duration)
  },

  remove(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  },

  clear() {
    notifications.value = []
  },

  clearLogs() {
    logs.value = []
  },

  getLogs(type?: NotificationType) {
    if (type) {
      return logs.value.filter(log => log.type === type)
    }
    return logs.value
  }
}
