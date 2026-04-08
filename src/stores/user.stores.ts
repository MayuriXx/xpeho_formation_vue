import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

type UserState = {
  name: string,
  age: number,
  city: string,
  phone: string,
  sports: string[]
}

export type HistoryEntry = {
  id: string,
  timestamp: number,
  action: string,
  changes: Record<string, unknown>
}

const initialState: UserState = {
  name: 'John Doe',
  age: 30,
  city: 'New York',
  phone: '123-456-7890',
  sports: ['Football', 'Basketball', 'Tennis']
}

export const useUserStore = defineStore('UserStore', {
  state: () => ({
    ...initialState,
    isAuthenticated: useLocalStorage<boolean>('user_authenticated', false),
    history: useLocalStorage<HistoryEntry[]>('user_history', []),
    userDataStorage: useLocalStorage<UserState>('user_data', initialState)
  }),
  
  getters: {
    getHistory(): HistoryEntry[] {
      return this.history
    },
    getSortedHistory(): HistoryEntry[] {
      return [...this.history].sort((a, b) => b.timestamp - a.timestamp)
    }
  },
  actions: {
    loadFromStorage() {
      const stored = this.userDataStorage
      if (stored) {
        this.name = stored.name
        this.age = stored.age
        this.city = stored.city
        this.phone = stored.phone
        this.sports = stored.sports
      }
    },

    saveToStorage() {
      this.userDataStorage = {
        name: this.name,
        age: this.age,
        city: this.city,
        phone: this.phone,
        sports: [...this.sports]
      }
    },

    addHistoryEntry(action: string, changes: Record<string, unknown>) {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        action,
        changes
      }
      this.history.push(entry)
    },

    setUser(user: UserState) {
      const changes = {
        name: user.name,
        age: user.age,
        city: user.city,
        phone: user.phone,
        sports: user.sports
      }
      this.name = user.name
      this.age = user.age
      this.city = user.city
      this.phone = user.phone
      this.sports = user.sports
      this.addHistoryEntry('setUser', changes)
      this.saveToStorage()
    },

    updateUser(user: Partial<UserState>) {
      const changes: Record<string, unknown> = {}
      if (user.name !== undefined) {
        this.name = user.name
        changes.name = user.name
      }
      if (user.age !== undefined) {
        this.age = user.age
        changes.age = user.age
      }
      if (user.city !== undefined) {
        this.city = user.city
        changes.city = user.city
      }
      if (user.phone !== undefined) {
        this.phone = user.phone
        changes.phone = user.phone
      }
      if (user.sports !== undefined) {
        this.sports = user.sports
        changes.sports = user.sports
      }
      this.addHistoryEntry('updateUser', changes)
      this.saveToStorage()
    },

    resetUser() {
      Object.assign(this, initialState)
      this.addHistoryEntry('resetUser', { restored: initialState })
      this.saveToStorage()
    },

    clearUser() {
      this.name = ''
      this.age = 0
      this.city = ''
      this.phone = ''
      this.sports = []
      this.addHistoryEntry('clearUser', { cleared: true })
      this.saveToStorage()
    },

    incrementAge() {
      const oldAge = this.age
      this.age++
      this.addHistoryEntry('incrementAge', { from: oldAge, to: this.age })
      this.saveToStorage()
    },

    incrementAgeBy5() {
      const oldAge = this.age
      this.age += 5
      this.addHistoryEntry('incrementAgeBy5', { from: oldAge, to: this.age })
      this.saveToStorage()
    },

    decrementAgeBy10() {
      if (this.age - 10 >= 0) {
        const oldAge = this.age
        this.age -= 10
        this.addHistoryEntry('decrementAgeBy10', { from: oldAge, to: this.age })
        this.saveToStorage()
      } else {
        throw new Error("Age cannot be negative!")
      }
    },

    updateName(newName: string) {
      const oldName = this.name
      this.name = newName
      this.addHistoryEntry('updateName', { from: oldName, to: newName })
      this.saveToStorage()
    },

    updateSports(newSports: string[]) {
      const oldSports = [...this.sports]
      this.sports = newSports
      this.addHistoryEntry('updateSports', { from: oldSports, to: newSports })
      this.saveToStorage()
    },

    clearHistory() {
      this.history = []
    }
  }
})