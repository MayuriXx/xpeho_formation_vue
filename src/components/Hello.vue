<script setup lang="ts">
import Counter from './Counter.vue'
import { computed } from 'vue'
import { useUserStore } from '../stores/user.stores'

const availableSports = ['Football', 'Basketball', 'Tennis', 'Swimming', 'Cycling', 'Skiing']
const store = useUserStore()

const nameInput = computed({
  get: () => store.name,
  set: (newName: string) => {
    store.updateName(newName)
  }
})

const statusMajeur = computed(() => {
  return store.age >= 18 ? 'Adult' : 'Minor'
})

function toggleSport(sport: string) {
  const newSports = store.sports.includes(sport)
    ? store.sports.filter(s => s !== sport)
    : [...store.sports, sport]
  store.updateSports(newSports)
}
</script>

<template>
  <div>
    <h1>Hello, {{ nameInput }}!</h1>
    
    <form @submit.prevent>
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="nameInput"
          type="text"
          placeholder="Enter your name"
        />
      </div>
    </form>

    <img v-if="nameInput === 'pierre'" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWJ3MGhzZmkyejc0N3RlN2R6YnBsbmEwbnlkY3J6cWMyODB4bGd3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RNEOLEEqeFFx6/giphy.gif" alt="Pierre gif" style="max-width: 300px; margin: 20px 0;" />
    <img v-else-if="nameInput === 'damiens'" src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTJxNTZ5aG92bWtmN2t4bGJxcDg3dXN1aHQ1YjNleTB5NW1oN2twcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9WxB6krnQPBwA/giphy.gif" alt="Damiens gif" style="max-width: 300px; margin: 20px 0;" />
    <img v-show="nameInput == 'Toto'" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWI0NTgzcjhxbmtvNnltaW9lcnR5NzJ0NHVsc3g0Nm1rYnJnczJndSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gdGIvVZYByAe9ET54g/giphy.gif" alt="toto gif" style="max-width: 300px; margin: 20px 0;" />

    <p>Age: {{ store.age }}</p>
    <p>Status: <strong>{{ statusMajeur }}</strong></p>
    <p>City: {{ store.city }}</p>
    <p>Phone: {{ store.phone }}</p>
    
    <div style="margin: 20px 0;">
      <p><strong>Sports:</strong></p>
      <div>
        <label v-for="sport in availableSports" :key="sport" style="display: block; margin: 8px 0;">
          <input
            type="checkbox"
            :checked="store.sports.includes(sport)"
            @change="toggleSport(sport)"
          />
          {{ sport }}
        </label>
      </div>
      <p v-if="store.sports.length > 0">Selected: {{ store.sports.join(', ') }}</p>
    </div>
    
    <Counter @increment="store.incrementAge()" @incrementBy5="store.incrementAgeBy5()" @decrementBy10="store.decrementAgeBy10()" @reset="store.resetUser()" />
  </div>
</template>

<style scoped></style>
