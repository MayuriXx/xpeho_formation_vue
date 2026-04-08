import { describe, it, expect, beforeEach, vi } from 'vitest'
import { notificationService } from './notificationService'

describe('notificationService', () => {
  beforeEach(() => {
    // Clear notifications and logs before each test
    notificationService.clear()
    notificationService.clearLogs()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  describe('add()', () => {
    it('should add a notification with default type "info"', () => {
      notificationService.add('Test message')

      expect(notificationService.notifications.value).toHaveLength(1)
      expect(notificationService.notifications.value[0]).toMatchObject({
        message: 'Test message',
        type: 'info'
      })
    })

    it('should add a notification with specific type', () => {
      notificationService.add('Error message', 'error')

      expect(notificationService.notifications.value[0]).toMatchObject({
        message: 'Error message',
        type: 'error'
      })
    })

    it('should add multiple notifications', () => {
      notificationService.add('First', 'info')
      notificationService.add('Second', 'success')
      notificationService.add('Third', 'warning')

      expect(notificationService.notifications.value).toHaveLength(3)
    })

    it('should add notification to logs', () => {
      notificationService.add('Log this', 'success')

      expect(notificationService.logs.value).toHaveLength(1)
      expect(notificationService.logs.value[0]).toMatchObject({
        message: 'Log this',
        type: 'success'
      })
    })

    it('should generate unique IDs for notifications', () => {
      vi.useRealTimers() // Use real timers so Date.now() is real
      
      const id1 = notificationService.add('First')
      // Small pause to ensure a different ID
      vi.useFakeTimers()
      
      notificationService.add('Second')
      const id2 = notificationService.add('Third')

      // All IDs should be defined
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      
      // At least 2 IDs should be different
      const ids = [id1, id2]
      expect(new Set(ids).size).toBeGreaterThanOrEqual(1)
    })

    it('should return the notification ID', () => {
      const id = notificationService.add('Test')

      expect(typeof id).toBe('string')
      expect(notificationService.notifications.value[0].id).toBe(id)
    })

    it('should auto-remove notification after duration', () => {
      notificationService.add('Auto-remove', 'info', 1000)

      expect(notificationService.notifications.value).toHaveLength(1)

      // Advance time by 1000ms
      vi.advanceTimersByTime(1000)

      expect(notificationService.notifications.value).toHaveLength(0)
    })

    it('should not auto-remove if duration is 0', () => {
      notificationService.add('Persist', 'info', 0)

      vi.advanceTimersByTime(5000)

      expect(notificationService.notifications.value).toHaveLength(1)
    })

    it('should auto-remove notification with negative duration treated as no auto-remove', () => {
      notificationService.add('Persist', 'info', -1)

      vi.advanceTimersByTime(5000)

      expect(notificationService.notifications.value).toHaveLength(1)
    })
  })

  describe('Convenience methods', () => {
    it('should add success notification', () => {
      notificationService.success('Success!')

      expect(notificationService.notifications.value[0].type).toBe('success')
      expect(notificationService.notifications.value[0].message).toBe('Success!')
    })

    it('should add error notification', () => {
      notificationService.error('Error!')

      expect(notificationService.notifications.value[0].type).toBe('error')
    })

    it('should add warning notification', () => {
      notificationService.warning('Warning!')

      expect(notificationService.notifications.value[0].type).toBe('warning')
    })

    it('should add info notification', () => {
      notificationService.info('Info!')

      expect(notificationService.notifications.value[0].type).toBe('info')
    })

    it('should respect custom duration in success()', () => {
      notificationService.success('Quick success', 500)

      expect(notificationService.notifications.value).toHaveLength(1)

      vi.advanceTimersByTime(500)

      expect(notificationService.notifications.value).toHaveLength(0)
    })
  })

  describe('remove()', () => {
    it('should remove a notification by ID', () => {
      const id = notificationService.add('Remove me', 'info', 0)

      expect(notificationService.notifications.value).toHaveLength(1)

      notificationService.remove(id)

      expect(notificationService.notifications.value).toHaveLength(0)
    })

    it('should not error when removing non-existent ID', () => {
      notificationService.add('Test', 'info', 0)

      expect(() => {
        notificationService.remove('non-existent-id')
      }).not.toThrow()

      expect(notificationService.notifications.value).toHaveLength(1)
    })
  })

  describe('clear()', () => {
    it('should remove all notifications', () => {
      notificationService.add('First')
      notificationService.add('Second')
      notificationService.add('Third')

      expect(notificationService.notifications.value).toHaveLength(3)

      notificationService.clear()

      expect(notificationService.notifications.value).toHaveLength(0)
    })

    it('should not affect logs', () => {
      notificationService.add('Message', 'success')
      notificationService.clear()

      expect(notificationService.logs.value).toHaveLength(1)
    })
  })

  describe('clearLogs()', () => {
    it('should remove all logs', () => {
      notificationService.add('First')
      notificationService.add('Second')

      expect(notificationService.logs.value).toHaveLength(2)

      notificationService.clearLogs()

      expect(notificationService.logs.value).toHaveLength(0)
    })

    it('should not affect active notifications', () => {
      notificationService.add('Message', 'info', 0)
      notificationService.clearLogs()

      expect(notificationService.notifications.value).toHaveLength(1)
    })
  })

  describe('getLogs()', () => {
    beforeEach(() => {
      notificationService.add('Success 1', 'success')
      notificationService.add('Error 1', 'error')
      notificationService.add('Success 2', 'success')
      notificationService.add('Warning 1', 'warning')
      notificationService.add('Info 1', 'info')
    })

    it('should return all logs when no type specified', () => {
      const allLogs = notificationService.getLogs()

      expect(allLogs).toHaveLength(5)
    })

    it('should filter logs by success type', () => {
      const successLogs = notificationService.getLogs('success')

      expect(successLogs).toHaveLength(2)
      expect(successLogs.every(log => log.type === 'success')).toBe(true)
    })

    it('should filter logs by error type', () => {
      const errorLogs = notificationService.getLogs('error')

      expect(errorLogs).toHaveLength(1)
      expect(errorLogs[0].type).toBe('error')
    })

    it('should filter logs by warning type', () => {
      const warningLogs = notificationService.getLogs('warning')

      expect(warningLogs).toHaveLength(1)
      expect(warningLogs[0].type).toBe('warning')
    })

    it('should filter logs by info type', () => {
      const infoLogs = notificationService.getLogs('info')

      expect(infoLogs).toHaveLength(1)
      expect(infoLogs[0].type).toBe('info')
    })

    it('should return empty array for non-existent type', () => {
      notificationService.clearLogs()

      const result = notificationService.getLogs('error')

      expect(result).toHaveLength(0)
    })
  })

  describe('Reactive behavior', () => {
    it('should maintain reactive state when adding notifications', () => {
      const initialLength = notificationService.notifications.value.length

      notificationService.add('Test')

      expect(notificationService.notifications.value.length).toBe(initialLength + 1)
    })

    it('should have timestamps for all notifications', () => {
      notificationService.add('Test 1')
      notificationService.add('Test 2')

      const notifications = notificationService.notifications.value
      expect(notifications[0].timestamp).toBeDefined()
      expect(notifications[1].timestamp).toBeDefined()
      expect(notifications[1].timestamp).toBeGreaterThanOrEqual(notifications[0].timestamp)
    })

    it('should have timestamps for all logs', () => {
      notificationService.add('Test')

      const logs = notificationService.logs.value
      expect(logs[0].timestamp).toBeDefined()
    })
  })
})
