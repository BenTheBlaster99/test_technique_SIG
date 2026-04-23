<script setup lang="ts">
import { computed, onMounted } from 'vue'
import CandidatureFilters from '../components/CandidatureFilters.vue'
import CandidatureTable from '../components/CandidatureTable.vue'
import PaginationControls from '../components/PaginationControls.vue'
import { useCandidatureStore } from '../stores/candidatures'
import { useReferenceDataStore } from '../stores/referenceData'

const candidatureStore = useCandidatureStore()
const referenceDataStore = useReferenceDataStore()

const resultLabel = computed(() => {
  const count = candidatureStore.totalCount
  return `${count} candidate${count === 1 ? '' : 's'} found`
})

async function refreshList() {
  await referenceDataStore.load()
  await candidatureStore.loadList()
}

async function updateFilter(
  key: 'search' | 'statut' | 'poste' | 'dateFrom',
  value: string,
) {
  candidatureStore.updateFilters({
    [key]: value,
    page: 1,
  })
  await candidatureStore.loadList()
}

async function changePage(page: number) {
  candidatureStore.updateFilters({ page })
  await candidatureStore.loadList()
}

async function resetFilters() {
  candidatureStore.resetFilters()
  await candidatureStore.loadList()
}

onMounted(async () => {
  await refreshList()
})
</script>

<template>
  <section class="page-section">
    <header class="hero">
      <div>
        <p class="eyebrow">SIG Service technical test</p>
        <h1>Recruitment dashboard</h1>
        <p class="hero-copy">
          Review candidates, narrow the list quickly, and keep the current workflow reliable.
        </p>
      </div>

      <div class="hero-metrics">
        <article>
          <strong>{{ candidatureStore.totalCount }}</strong>
          <span>Total matches</span>
        </article>
        <article>
          <strong>{{ referenceDataStore.statuts.length }}</strong>
          <span>Tracked statuses</span>
        </article>
      </div>
    </header>

    <CandidatureFilters
      :search="candidatureStore.filters.search"
      :statut="candidatureStore.filters.statut"
      :poste="candidatureStore.filters.poste"
      :date-from="candidatureStore.filters.dateFrom"
      :statuts="referenceDataStore.statuts"
      :postes="referenceDataStore.postes"
      @update:search="updateFilter('search', $event)"
      @update:statut="updateFilter('statut', $event)"
      @update:poste="updateFilter('poste', $event)"
      @update:date-from="updateFilter('dateFrom', $event)"
      @reset="resetFilters"
    />

    <section class="content-shell">
      <div class="content-header">
        <div>
          <h2>Candidate list</h2>
          <p>{{ resultLabel }}</p>
        </div>

        <button type="button" @click="refreshList">
          Refresh data
        </button>
      </div>

      <div v-if="referenceDataStore.error || candidatureStore.listError" class="state-card error">
        <h3>Something went wrong</h3>
        <p>{{ referenceDataStore.error || candidatureStore.listError }}</p>
        <button type="button" @click="refreshList">
          Try again
        </button>
      </div>

      <div v-else-if="referenceDataStore.isLoading || candidatureStore.listLoading" class="state-card">
        <h3>Loading candidates</h3>
        <p>Fetching candidatures and reference data from JSON Server.</p>
      </div>

      <div v-else-if="candidatureStore.items.length === 0" class="state-card">
        <h3>No matching candidates</h3>
        <p>Try broadening the filters or clearing the search term.</p>
      </div>

      <template v-else>
        <CandidatureTable
          :items="candidatureStore.items"
          :status-map="referenceDataStore.statusMap"
        />

        <PaginationControls
          :current-page="candidatureStore.filters.page"
          :total-pages="candidatureStore.totalPages"
          @change="changePage"
        />
      </template>
    </section>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 1.5rem;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #13243d, #1f5f8b);
  color: white;
}

.hero h1 {
  margin: 0.25rem 0 0.75rem;
  font-size: clamp(2rem, 4vw, 3rem);
  color: inherit;
}

.hero-copy,
.eyebrow,
.hero-metrics span {
  color: rgba(255, 255, 255, 0.78);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  font-weight: 700;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 1rem;
  min-width: 250px;
}

.hero-metrics article {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.1);
}

.hero-metrics strong {
  font-size: 1.75rem;
}

.content-shell {
  display: grid;
  gap: 1rem;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.content-header h2 {
  margin: 0 0 0.25rem;
}

.content-header p {
  color: var(--muted-color);
}

.state-card {
  display: grid;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.state-card h3 {
  margin: 0;
  color: var(--heading-color);
}

.state-card p {
  color: var(--muted-color);
}

.state-card.error {
  border-color: rgba(220, 38, 38, 0.35);
}

@media (max-width: 860px) {
  .hero,
  .content-header {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-metrics {
    min-width: 0;
  }
}

@media (max-width: 560px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
