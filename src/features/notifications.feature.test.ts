import { describe, it, expect, beforeEach, vi } from 'vitest'
import { notificationService } from '../services/notificationService'

/**
 * Feature: Notifications
 * As a user
 * I want to see notifications
 * So that I am informed about application events
 */

describe('Feature: Notifications', () => {
  beforeEach(() => {
    notificationService.clear()
    notificationService.clearLogs()
    vi.useFakeTimers()
  })

  /**
   * Scenario: Success notification appears and disappears
   * Given the notification service is initialized
   * When I add a success notification "Operation successful"
   * Then the notification should appear
   * And it should disappear after 3 seconds
   */
  it('Scenario: Success notification appears and disappears', () => {
    // Given the notification service is initialized
    expect(notificationService.notifications.value).toHaveLength(0)

    // When I add a success notification
    notificationService.success('Operation successful', 3000)

    // Then the notification should appear
    expect(notificationService.notifications.value).toHaveLength(1)
    expect(notificationService.notifications.value[0]).toMatchObject({
      message: 'Operation successful',
      type: 'success'
    })

    // And it should disappear after 3 seconds
    vi.advanceTimersByTime(3000)
    expect(notificationService.notifications.value).toHaveLength(0)
  })

  /**
   * Scenario: Multiple notifications can coexist
   * Given the notification service is initialized
   * When I add a success notification "First"
   * And I add an error notification "Second"
   * And I add a warning notification "Third"
   * Then I should see 3 notifications
   * And they should have different types
   */
  it('Scenario: Multiple notifications can coexist', () => {
    // Given the notification service is initialized
    expect(notificationService.notifications.value).toHaveLength(0)

    // When I add a success notification
    notificationService.success('First', 0)

    // And I add an error notification
    notificationService.error('Second', 0)

    // And I add a warning notification
    notificationService.warning('Third', 0)

    // Then I should see 3 notifications
    expect(notificationService.notifications.value).toHaveLength(3)

    // And they should have different types
    const types = notificationService.notifications.value.map(n => n.type)
    expect(types).toContain('success')
    expect(types).toContain('error')
    expect(types).toContain('warning')
  })

  /**
   * Scenario: User can filter notifications by type
   * Given I have added multiple notifications of different types
   * When I request success notifications from the log
   * Then I should only see success notifications
   */
  it('Scenario: User can filter notifications by type', () => {
    // Given I have added multiple notifications of different types
    notificationService.success('Success 1')
    notificationService.error('Error 1')
    notificationService.success('Success 2')
    notificationService.warning('Warning 1')

    // When I request success notifications from the log
    const successLogs = notificationService.getLogs('success')

    // Then I should only see success notifications
    expect(successLogs).toHaveLength(2)
    expect(successLogs.every(log => log.type === 'success')).toBe(true)
  })

  /**
   * Scenario: Notification with zero duration persists
   * Given the notification service is initialized
   * When I add a notification with duration 0
   * Then the notification should appear
   * And it should not be auto-removed
   */
  it('Scenario: Notification with zero duration persists', () => {
    // Reset and use real timers for this test
    vi.useRealTimers()
    notificationService.clear()

    // When I add a notification with duration 0
    const id = notificationService.add('Persistent notification', 'info', 0)

    // Then the notification should appear
    expect(notificationService.notifications.value).toHaveLength(1)
    expect(notificationService.notifications.value[0].message).toBe('Persistent notification')
    expect(id).toBeDefined()

    // And it should still be there (no auto-removal because duration is 0)
    expect(notificationService.notifications.value).toHaveLength(1)

    vi.useFakeTimers()
  })
})
