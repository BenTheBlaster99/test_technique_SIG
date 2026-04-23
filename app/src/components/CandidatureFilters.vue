<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Poste, Statut } from '../types/models'

const props = defineProps<{
  search: string
  statut: string
  poste: string
  dateFrom: string
  statuts: Statut[]
  postes: Poste[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:statut': [value: string]
  'update:poste': [value: string]
  'update:dateFrom': [value: string]
  reset: []
}>()

const searchValue = ref(props.search)

watch(
  () => props.search,
  (value) => {
    searchValue.value = value
  },
)

let debounceTimer: number | undefined

watch(searchValue, (value) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    emit('update:search', value.trim())
  }, 350)
})

function handleStatusChange(event: Event) {
  emit('update:statut', (event.target as HTMLSelectElement).value)
}

function handlePosteChange(event: Event) {
  emit('update:poste', (event.target as HTMLSelectElement).value)
}

function handleDateChange(event: Event) {
  emit('update:dateFrom', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <section class="filters-panel" aria-label="Candidate filters">
    <div class="filters-grid">
      <label class="field">
        <span>Search</span>
        <input
          v-model="searchValue"
          type="search"
          placeholder="Search name, role, skill..."
        />
      </label>

      <label class="field">
        <span>Status</span>
        <select :value="statut" @change="handleStatusChange">
          <option value="">All statuses</option>
          <option
            v-for="item in statuts"
            :key="item.id"
            :value="item.nom"
          >
            {{ item.nom }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Position</span>
        <select :value="poste" @change="handlePosteChange">
          <option value="">All positions</option>
          <option
            v-for="item in postes"
            :key="item.id"
            :value="item.titre"
          >
            {{ item.titre }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>Applied after</span>
        <input
          :value="dateFrom"
          type="date"
          @input="handleDateChange"
        />
      </label>
    </div>

    <div class="actions">
      <button type="button" class="secondary-button" @click="emit('reset')">
        Reset filters
      </button>
    </div>
  </section>
</template>

<style scoped>
.filters-panel {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.filters-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.field {
  display: grid;
  gap: 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--heading-color);
}

.field span {
  color: var(--muted-color);
  font-size: 0.9rem;
}

.field input,
.field select {
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--input-color);
  color: var(--heading-color);
  font: inherit;
  box-sizing: border-box;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.secondary-button {
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--heading-color);
  cursor: pointer;
}

@media (max-width: 640px) {
  .actions {
    justify-content: stretch;
  }

  .secondary-button {
    width: 100%;
  }
}
</style>
