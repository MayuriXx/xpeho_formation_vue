<script setup lang="ts">
import Hello from './components/Hello.vue';
import History from './components/History.vue';
import MousePosition from './components/MousePosition.vue';
import { useUserStore } from './stores/user.stores'
import { onMounted, watch } from 'vue'

const store = useUserStore();

onMounted(() => {
  // Charger les données sauvegardées au démarrage
  store.loadFromStorage()
})

watch(() => store.age, (newAge, oldAge) => {
  console.log(`🔔 Âge modifié: ${oldAge} → ${newAge}`)
})

function handleIncrement() {
  store.incrementAge();
}

function handleIncrementBy5() {
  store.incrementAgeBy5();
}

function handleDecrement() {
  try {
    store.decrementAgeBy10();
  } catch (error) {
    alert((error as Error).message)
  }
}

function handleUpdateName(newName: string) {
  store.updateName(newName);
}

function handleUpdateSports(newSports: string[]) {
  store.updateSports(newSports);
}

function handleReset() {
  store.resetUser();
}
</script>

<template>
  <div class="app-container">
    <div class="main-content">
      <MousePosition />
      <Hello 
        :person="store" 
        @increment="handleIncrement"
        @incrementBy5="handleIncrementBy5"
        @decrementBy10="handleDecrement"
        @reset="handleReset"
        @update:name="handleUpdateName"
        @update:sports="handleUpdateSports"
      />
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

