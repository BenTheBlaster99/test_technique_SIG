<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StatusBadge from './StatusBadge.vue'
import type { Candidature, Statut } from '../types/models'

defineProps<{
  items: Candidature[]
  statusMap: Map<string, Statut>
}>()

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(new Date(value))
}
</script>

<template>
  <section class="table-wrapper" aria-label="Candidate results">
    <div class="table-header">
      <span>Candidate</span>
      <span>Position</span>
      <span>Status</span>
      <span>Applied</span>
      <span>Actions</span>
    </div>

    <article
      v-for="item in items"
      :key="item.id"
      class="candidate-row"
    >
      <div class="cell">
        <span class="cell-label">Candidate</span>
        <strong>{{ item.nom }}</strong>
        <span class="muted">{{ item.localisation }}</span>
      </div>

      <div class="cell">
        <span class="cell-label">Position</span>
        <span>{{ item.poste }}</span>
        <span class="muted">{{ item.experience }} experience</span>
      </div>

      <div class="cell">
        <span class="cell-label">Status</span>
        <StatusBadge
          :label="item.statut"
          :color="statusMap.get(item.statut)?.couleur"
        />
      </div>

      <div class="cell">
        <span class="cell-label">Applied</span>
        <span>{{ formatDate(item.dateCandidature) }}</span>
      </div>

      <div class="cell actions-cell">
        <span class="cell-label">Actions</span>
        <RouterLink class="primary-link" :to="`/candidatures/${item.id}`">
          Open details
        </RouterLink>
      </div>
    </article>
  </section>
</template>

<style scoped>
.table-wrapper {
  display: grid;
  gap: 0.75rem;
}

.table-header,
.candidate-row {
  display: grid;
  grid-template-columns: 1.6fr 1.2fr 1fr 0.9fr 0.9fr;
  gap: 1rem;
  align-items: center;
}

.table-header {
  padding: 0 1rem;
  color: var(--muted-color);
  font-size: 0.9rem;
  font-weight: 700;
}

.candidate-row {
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.cell {
  display: grid;
  gap: 0.25rem;
}

.cell strong,
.cell span {
  color: var(--heading-color);
}

.muted {
  color: var(--muted-color) !important;
  font-size: 0.92rem;
}

.primary-link {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-height: 2.75rem;
}

.cell-label {
  display: none;
  color: var(--muted-color) !important;
  font-size: 0.85rem;
  font-weight: 700;
}

@media (max-width: 860px) {
  .table-header {
    display: none;
  }

  .candidate-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cell-label {
    display: inline-flex;
  }
}

@media (max-width: 560px) {
  .candidate-row {
    grid-template-columns: 1fr;
  }
}
</style>
