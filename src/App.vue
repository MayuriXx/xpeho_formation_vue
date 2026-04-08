<script setup lang="ts">
import History from './components/History.vue';
import MousePosition from './components/MousePosition.vue';
import { useUserStore } from './stores/user.stores'
import { notificationService } from './services/notificationService'
import { onMounted, watch, provide } from 'vue'

const store = useUserStore();

provide('notificationService', notificationService)

onMounted(() => {
  // Charger les données sauvegardées au démarrage
  store.loadFromStorage()
})

watch(() => store.age, (newAge, oldAge) => {
  console.log(`🔔 Âge modifié: ${oldAge} → ${newAge}`)
})
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <MousePosition />
      <RouterView />
    </div>
    <History />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>

