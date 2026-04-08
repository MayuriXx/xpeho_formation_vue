<script setup lang="ts">
defineEmits<{
  increment: []
  incrementBy5: []
  decrementBy10: []
  reset: []
}>()
</script>

<template>
  <button @click="$emit('increment')">Increment</button>
  <button @click="$emit('incrementBy5')">Increment +5</button>
  <button @click="$emit('decrementBy10')">Decrement -10</button>
  <button @click="$emit('reset')">Reset</button>
</template>

<style scoped></style>