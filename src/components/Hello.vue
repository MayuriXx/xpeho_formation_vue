<script setup lang="ts">
import type { Person } from '../types/Person'
import Counter from './Counter.vue'
import { computed, onBeforeMount } from 'vue'

const availableSports = ['Football', 'Basketball', 'Tennis', 'Natation', 'Cyclisme', 'Ski']

const props = defineProps<{
  person: Person
}>()

const emit = defineEmits<{
  increment: []
  incrementBy5: []
  decrementBy10: []
  reset: []
  'update:name': [name: string]
  'update:sports': [sports: string[]]
}>()

onBeforeMount(() => {
  console.log('Hello.vue beforeMount - Composant en cours de montage', {
    name: props.person.name,
    age: props.person.age,
    nameInputValue: props.person.name,
  })
})

const nameInput = computed({
  get: () => props.person.name,
  set: (newName: string) => {
    emit('update:name', newName)
  }
})

const statusMajeur = computed(() => {
  return props.person.age >= 18 ? 'majeur' : 'mineur'
})

function toggleSport(sport: string) {
  const newSports = props.person.sports.includes(sport)
    ? props.person.sports.filter(s => s !== sport)
    : [...props.person.sports, sport]
  emit('update:sports', newSports)
}
</script>

<template>
  <div>
    <h1>Hello, {{ nameInput }}!</h1>
    
    <form @submit.prevent>
      <div>
        <label for="name">Nom:</label>
        <input
          id="name"
          v-model="nameInput"
          type="text"
          placeholder="Entrez votre nom"
        />
      </div>
    </form>

    <img v-if="nameInput === 'pierre'" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWJ3MGhzZmkyejc0N3RlN2R6YnBsbmEwbnlkY3J6cWMyODB4bGd3MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RNEOLEEqeFFx6/giphy.gif" alt="Pierre gif" style="max-width: 300px; margin: 20px 0;" />
    <img v-else-if="nameInput === 'damiens'" src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTJxNTZ5aG92bWtmN2t4bGJxcDg3dXN1aHQ1YjNleTB5NW1oN2twcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9WxB6krnQPBwA/giphy.gif" alt="Damiens gif" style="max-width: 300px; margin: 20px 0;" />
    <img v-show="nameInput == 'Toto'" src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWI0NTgzcjhxbmtvNnltaW9lcnR5NzJ0NHVsc3g0Nm1rYnJnczJndSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gdGIvVZYByAe9ET54g/giphy.gif" alt="toto gif" style="max-width: 300px; margin: 20px 0;" />

    <p>Age: {{ props.person.age }}</p>
    <p>Statut: <strong>{{ statusMajeur }}</strong></p>
    <p>City: {{ props.person.city }}</p>
    <p>Phone: {{ props.person.phone }}</p>
    
    <div style="margin: 20px 0;">
      <p><strong>Sports:</strong></p>
      <div>
        <label v-for="sport in availableSports" :key="sport" style="display: block; margin: 8px 0;">
          <input
            type="checkbox"
            :checked="props.person.sports.includes(sport)"
            @change="toggleSport(sport)"
          />
          {{ sport }}
        </label>
      </div>
      <p v-if="props.person.sports.length > 0">Sélectionnés: {{ props.person.sports.join(', ') }}</p>
    </div>
    
    <Counter @increment="$emit('increment')" @incrementBy5="$emit('incrementBy5')" @decrementBy10="$emit('decrementBy10')" @reset="$emit('reset')" />
  </div>
</template>

<style scoped></style>
