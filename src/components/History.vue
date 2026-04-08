<script setup lang="ts">
import { useUserStore } from '../stores/user.stores'
import { computed, inject } from 'vue'

const store = useUserStore()
const notificationService = inject<any>('notificationService')

const sortedHistory = computed(() => store.getSortedHistory)

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('fr-FR')
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    incrementAge: 'Âge augmenté de 1',
    incrementAgeBy5: 'Âge augmenté de 5',
    decrementAgeBy10: 'Âge diminué de 10',
    updateName: 'Nom modifié',
    updateSports: 'Sports modifiés',
    setUser: 'Utilisateur défini',
    updateUser: 'Utilisateur mis à jour',
    resetUser: 'Utilisateur réinitialisé',
    clearUser: 'Utilisateur effacé'
  }
  return labels[action] || action
}

function handleClearHistory() {
  store.clearHistory()
  notificationService.success('✓ Historique effacé avec succès!')
}
</script>

<template>
  <div class="history-panel">
    <h2>📋 Historique</h2>
    
    <div v-if="sortedHistory.length === 0" class="empty-history">
      <p>Aucun historique pour le moment</p>
    </div>

    <div v-else class="history-list">
      <div v-for="entry in sortedHistory" :key="entry.id" class="history-item">
        <div class="history-header">
          <span class="action-label">{{ getActionLabel(entry.action) }}</span>
          <span class="timestamp">{{ formatDate(entry.timestamp) }}</span>
        </div>
        <div class="history-changes">
          <div v-for="(value, key) in entry.changes" :key="`${entry.id}-${key}`" class="change-item">
            <span class="change-key">{{ key }}:</span>
            <span class="change-value">{{ JSON.stringify(value) }}</span>
          </div>
        </div>
      </div>

      <button @click="handleClearHistory()" class="clear-btn">
        🗑️ Effacer l'historique
      </button>
    </div>
  </div>
</template>

<style scoped>
.history-panel {
  border-left: 2px solid #e0e0e0;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  background-color: #f9f9f9;
  width: 300px;
}

h2 {
  font-size: 1.25rem;
  margin: 0 0 20px 0;
  color: #333;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  font-size: 0.85rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.action-label {
  color: #2c3e50;
}

.timestamp {
  color: #999;
  font-size: 0.8rem;
  font-weight: normal;
}

.history-changes {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
}

.change-item {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  word-break: break-all;
}

.change-item:last-child {
  margin-bottom: 0;
}

.change-key {
  font-weight: 600;
  color: #666;
  min-width: 60px;
}

.change-value {
  color: #999;
  font-family: monospace;
  overflow-wrap: break-word;
}

.clear-btn {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: #ee5a52;
}
</style>
