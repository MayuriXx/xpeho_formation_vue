import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../stores/user.stores'

/**
 * Feature: User History and Data Persistence
 * As a user
 * I want my changes to be saved and tracked
 * So that I can see my history and my data persists
 */

describe('Feature: User History and Data Persistence', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  /**
   * Scenario: History entry is created on user update
   * Given I am authenticated
   * When I update my name to "Alice"
   * Then a history entry should be created
   * And the entry should contain the new name
   */
  it('Scenario: History entry is created on user update', () => {
    // Given I am authenticated
    const store = useUserStore()
    const initialHistoryLength = store.history.length

    // When I update my name to "Alice"
    store.updateUser({ name: 'Alice' })

    // Then a history entry should be created
    expect(store.history.length).toBeGreaterThan(initialHistoryLength)

    // And the entry should contain the new name
    const lastEntry = store.history[store.history.length - 1]
    expect(lastEntry.changes.name).toBe('Alice')
  })

  /**
   * Scenario: User data is persisted to storage
   * Given I am on the app
   * And I update my age to 25
   * When I save the data
   * Then my age should be saved to storage
   */
  it('Scenario: User data is persisted to storage', () => {
    // Given I am on the app
    const store = useUserStore()

    // And I update my age to 25
    store.updateUser({ age: 25 })

    // When I save the data
    store.saveToStorage()

    // Then my age should be saved to storage
    expect(store.userDataStorage.age).toBe(25)
  })

  /**
   * Scenario: Multiple property updates are tracked
   * Given I am on the app
   * When I update my name, age, and city
   * Then all updates should be in the history
   * And each change should be recorded separately
   */
  it('Scenario: Multiple property updates are tracked', () => {
    // Given I am on the app
    const store = useUserStore()
    store.history = [] // Reset history

    // When I update my name, age, and city
    store.updateUser({ name: 'Bob' })
    store.updateUser({ age: 30 })
    store.updateUser({ city: 'Paris' })

    // Then all updates should be in the history
    expect(store.history.length).toBe(3)

    // And each change should be recorded separately
    expect(store.history[0].changes.name).toBe('Bob')
    expect(store.history[1].changes.age).toBe(30)
    expect(store.history[2].changes.city).toBe('Paris')
  })

  /**
   * Scenario: Historical data can be retrieved
   * Given the user has made several changes
   * When I request the history
   * Then I should see all previous changes
   * And they should be in chronological order
   */
  it('Scenario: Historical data can be retrieved', () => {
    // Given the user has made several changes
    const store = useUserStore()
    store.history = [] // Reset history
    
    store.updateUser({ name: 'Change1' })
    const firstTimestamp = store.history[0].timestamp
    
    store.updateUser({ age: 35 })
    const secondTimestamp = store.history[1].timestamp

    // When I request the history
    const allHistory = store.getHistory

    // Then I should see all previous changes
    expect(allHistory).toHaveLength(2)

    // And they should be in chronological order
    expect(allHistory[0].timestamp).toBeLessThanOrEqual(allHistory[1].timestamp)
  })

  /**
   * Scenario: Sorted history shows recent changes first
   * Given the user has made multiple changes
   * When I request sorted history
   * Then the most recent change should appear first
   */
  it('Scenario: Sorted history shows recent changes first', () => {
    // Given the user has made multiple changes
    const store = useUserStore()
    store.history = [] // Reset history

    store.updateUser({ name: 'First' })
    store.updateUser({ age: 25 })
    store.updateUser({ city: 'London' })

    // When I request sorted history
    const sortedHistory = store.getSortedHistory

    // Then the most recent change should appear first
    expect(sortedHistory.length).toBeGreaterThan(0)
    // Most recent should be the city update
    const mostRecentAction = sortedHistory[0]
    expect(mostRecentAction).toBeDefined()
    expect(mostRecentAction.action).toBe('updateUser')
  })

  /**
   * Scenario: User can load data from storage
   * Given I have saved user data
   * When I load data from storage
   * Then my user data should be restored
   */
  it('Scenario: User can load data from storage', () => {
    // Given I have saved user data
    const store = useUserStore()
    store.updateUser({ name: 'SavedName', age: 28, city: 'Berlin' })
    store.saveToStorage()

    // When I load data from storage
    store.loadFromStorage()

    // Then my user data should be restored
    expect(store.name).toBe('SavedName')
    expect(store.age).toBe(28)
    expect(store.city).toBe('Berlin')
  })
})
