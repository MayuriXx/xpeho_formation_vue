<script setup lang="ts">
import { useMouse } from '../composables/mouse'

const { x, y } = useMouse()
</script>

<template>
  <div class="mouse-position">
    <p>Position de la souris: <strong>{{ x }}, {{ y }}</strong></p>
  </div>
</template>

<style scoped>
.mouse-position {
  padding: 1rem;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: #f0f9f6;
  font-size: 1.2rem;
}

p {
  margin: 0;
}

strong {
  color: #42b883;
}
</style>
