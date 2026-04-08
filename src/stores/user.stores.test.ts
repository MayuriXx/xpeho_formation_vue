import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from './user.stores'

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('loadFromStorage', () => {
    it('should restore user data from storage', () => {
      const store = useUserStore()

      // Modify the data
      store.name = 'Jane Doe'
      store.age = 25
      store.city = 'Paris'

      // Save
      store.saveToStorage()

      // Create a new store (simulates a reload)
      const newStore = useUserStore()

      // Load from storage
      newStore.loadFromStorage()

      // Verify that the data is restored
      expect(newStore.name).toBe('Jane Doe')
      expect(newStore.age).toBe(25)
      expect(newStore.city).toBe('Paris')
    })

    it('should keep initial state if no data in storage', () => {
      const store = useUserStore()

      // Load from storage (even if empty)
      store.loadFromStorage()

      // Default values should be preserved
      expect(store.name).toBe('John Doe')
      expect(store.age).toBe(30)
    })
  })

  describe('saveToStorage', () => {
    it('should persist user data to storage', () => {
      const store = useUserStore()

      // Modify the data
      store.name = 'Alice'
      store.age = 28
      store.city = 'Lyon'
      store.phone = '999-888-7777'
      store.sports = ['Tennis', 'Swimming']

      // Save
      store.saveToStorage()

      // Verify that userDataStorage (reactive ref) changed
      expect(store.userDataStorage.name).toBe('Alice')
      expect(store.userDataStorage.age).toBe(28)
      expect(store.userDataStorage.city).toBe('Lyon')
      expect(store.userDataStorage.phone).toBe('999-888-7777')
      expect(store.userDataStorage.sports).toEqual(['Tennis', 'Swimming'])
    })
  })

  describe('addHistoryEntry', () => {
    it('should add a history entry with correct structure', () => {
      const store = useUserStore()
      const initialLength = store.history.length

      // Add an entry
      store.addHistoryEntry('nameChanged', { name: 'Alice' })

      // Verify that the entry was added
      expect(store.history.length).toBe(initialLength + 1)

      const lastEntry = store.history[store.history.length - 1]
      expect(lastEntry.action).toBe('nameChanged')
      expect(lastEntry.changes).toEqual({ name: 'Alice' })
      expect(lastEntry.id).toBeDefined()
      expect(lastEntry.timestamp).toBeDefined()
    })

    it('should add multiple history entries', () => {
      const store = useUserStore()

      store.addHistoryEntry('action1', { field: 'value1' })
      store.addHistoryEntry('action2', { field: 'value2' })
      store.addHistoryEntry('action3', { field: 'value3' })

      expect(store.history.length).toBe(3)
      expect(store.history[0].action).toBe('action1')
      expect(store.history[1].action).toBe('action2')
      expect(store.history[2].action).toBe('action3')
    })

    it('should have unique IDs for each entry', () => {
      const store = useUserStore()

      store.addHistoryEntry('action1', {})
      store.addHistoryEntry('action2', {})

      const ids = store.history.map(entry => entry.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(2)
    })
  })

  describe('updateUser', () => {
    it('should update a single user property', () => {
      const store = useUserStore()

      store.updateUser({ name: 'Bob' })

      expect(store.name).toBe('Bob')
      expect(store.age).toBe(30) // Other properties unchanged
    })

    it('should update multiple user properties at once', () => {
      const store = useUserStore()

      store.updateUser({
        name: 'Charlie',
        age: 35,
        city: 'Marseille'
      })

      expect(store.name).toBe('Charlie')
      expect(store.age).toBe(35)
      expect(store.city).toBe('Marseille')
      expect(store.phone).toBe('123-456-7890') // Unchanged
    })

    it('should add history entry when updating user', () => {
      const store = useUserStore()
      const initialHistoryLength = store.history.length

      store.updateUser({ name: 'David' })

      expect(store.history.length).toBeGreaterThan(initialHistoryLength)
      const lastEntry = store.history[store.history.length - 1]
      expect(lastEntry.changes.name).toBe('David')
    })

    it('should not add entry for undefined properties', () => {
      const store = useUserStore()
      store.history = [] // Reset history

      store.updateUser({ name: 'Eve', age: undefined })

      expect(store.name).toBe('Eve')
      const lastEntry = store.history[store.history.length - 1]
      expect(lastEntry.changes.age).toBeUndefined()
    })

    it('should persist changes to storage', () => {
      const store = useUserStore()

      store.updateUser({ name: 'Frank', city: 'Toulouse' })
      store.saveToStorage()

      // Verify that userDataStorage reflects the changes
      expect(store.userDataStorage.name).toBe('Frank')
      expect(store.userDataStorage.city).toBe('Toulouse')
    })

    it('should handle array updates (sports)', () => {
      const store = useUserStore()

      store.updateUser({ sports: ['Cricket', 'Golf'] })

      expect(store.sports).toEqual(['Cricket', 'Golf'])
    })
  })
})
