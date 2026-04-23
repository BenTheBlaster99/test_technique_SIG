<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import CommentForm from '../components/CommentForm.vue'
import CommentList from '../components/CommentList.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useCandidatureStore } from '../stores/candidatures'
import { useReferenceDataStore } from '../stores/referenceData'

const route = useRoute()
const candidatureStore = useCandidatureStore()
const referenceDataStore = useReferenceDataStore()

const candidateId = computed(() => Number(route.params.id))
const selectedStatus = computed(() => candidatureStore.selected?.statut ?? '')

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function loadCandidate() {
  await referenceDataStore.load()

  if (!Number.isNaN(candidateId.value)) {
    await candidatureStore.loadById(candidateId.value)
  }
}

async function handleStatusChange(event: Event) {
  const nextStatus = (event.target as HTMLSelectElement).value

  if (!candidatureStore.selected || nextStatus === candidatureStore.selected.statut) {
    return
  }

  await candidatureStore.updateStatus(candidatureStore.selected.id, nextStatus)
}

async function handleCommentSubmit(payload: { auteur: string; contenu: string }) {
  if (!candidatureStore.selected) {
    return
  }

  await candidatureStore.addComment(candidatureStore.selected.id, payload.auteur, payload.contenu)
}

watch(
  () => route.params.id,
  async () => {
    await loadCandidate()
  },
)

onMounted(async () => {
  await loadCandidate()
})
</script>

<template>
  <section class="page-section">
    <RouterLink class="back-link" to="/">
      Back to candidate list
    </RouterLink>

    <div v-if="candidatureStore.detailError" class="state-card error">
      <h2>Unable to load this candidature</h2>
      <p>{{ candidatureStore.detailError }}</p>
      <button type="button" @click="loadCandidate">
        Try again
      </button>
    </div>

    <div v-else-if="candidatureStore.detailLoading || !candidatureStore.selected" class="state-card">
      <h2>Loading candidate profile</h2>
      <p>Retrieving the detailed record from JSON Server.</p>
    </div>

    <template v-else>
      <header class="detail-header">
        <div>
          <p class="eyebrow">Candidate profile</p>
          <h1>{{ candidatureStore.selected.nom }}</h1>
          <p class="detail-copy">
            {{ candidatureStore.selected.poste }} · {{ candidatureStore.selected.localisation }}
          </p>
        </div>

        <StatusBadge
          :label="candidatureStore.selected.statut"
          :color="referenceDataStore.statusMap.get(candidatureStore.selected.statut)?.couleur"
        />
      </header>

      <div
        v-if="candidatureStore.saveSuccess || candidatureStore.saveError"
        class="feedback-banner"
        :class="{ error: candidatureStore.saveError }"
      >
        {{ candidatureStore.saveSuccess || candidatureStore.saveError }}
      </div>

      <section class="detail-grid">
        <article class="info-card">
          <h2>Profile summary</h2>
          <dl class="definition-list">
            <div>
              <dt>Email</dt>
              <dd>{{ candidatureStore.selected.email }}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{{ candidatureStore.selected.telephone }}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{{ candidatureStore.selected.experience }}</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>{{ candidatureStore.selected.disponibilite }}</dd>
            </div>
            <div>
              <dt>Salary expectation</dt>
              <dd>{{ candidatureStore.selected.salaireSouhaite.toLocaleString('en-GB') }} EUR</dd>
            </div>
            <div>
              <dt>Applied on</dt>
              <dd>{{ formatDate(candidatureStore.selected.dateCandidature) }}</dd>
            </div>
            <div>
              <dt>CV</dt>
              <dd>
                <a :href="candidatureStore.selected.cv" target="_blank" rel="noreferrer">
                  Open external CV link
                </a>
              </dd>
            </div>
          </dl>
        </article>

        <article class="info-card">
          <h2>Skills</h2>
          <div class="tag-list">
            <span v-for="skill in candidatureStore.selected.competences" :key="skill" class="tag">
              {{ skill }}
            </span>
          </div>

          <div class="status-editor">
            <label class="field">
              <span>Update status</span>
              <select :value="selectedStatus" @change="handleStatusChange">
                <option
                  v-for="status in referenceDataStore.statuts"
                  :key="status.id"
                  :value="status.nom"
                >
                  {{ status.nom }}
                </option>
              </select>
            </label>
          </div>
        </article>
      </section>

      <article class="info-card">
        <h2>Motivation letter</h2>
        <p class="letter-copy">
          {{ candidatureStore.selected.lettreMotivation }}
        </p>
      </article>

      <section class="detail-grid">
        <CommentList :comments="candidatureStore.selected.commentaires" />
        <CommentForm :is-saving="candidatureStore.isSaving" @submit="handleCommentSubmit" />
      </section>
    </template>
  </section>
</template>

<style scoped>
.page-section {
  display: grid;
  gap: 1.5rem;
}

.back-link {
  justify-self: flex-start;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--muted-color);
}

.detail-header h1,
.info-card h2 {
  margin: 0.35rem 0 0.5rem;
}

.detail-copy,
.letter-copy {
  color: var(--muted-color);
  line-height: 1.6;
}

.feedback-banner {
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  color: #166534;
  background: #dcfce7;
  border: 1px solid #86efac;
}

.feedback-banner.error {
  color: #991b1b;
  background: #fee2e2;
  border-color: #fca5a5;
}

.detail-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.info-card,
.state-card {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.state-card.error {
  border-color: rgba(220, 38, 38, 0.35);
}

.definition-list {
  display: grid;
  gap: 0.95rem;
  margin: 0;
}

.definition-list div {
  display: grid;
  gap: 0.25rem;
}

.definition-list dt {
  color: var(--muted-color);
  font-size: 0.92rem;
}

.definition-list dd {
  margin: 0;
  color: var(--heading-color);
  word-break: break-word;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.tag {
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: var(--tag-color);
  color: var(--heading-color);
  font-weight: 600;
}

.status-editor {
  padding-top: 0.5rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field span {
  color: var(--muted-color);
  font-size: 0.92rem;
  font-weight: 600;
}

.field select {
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--input-color);
  color: var(--heading-color);
  font: inherit;
}

@media (max-width: 860px) {
  .detail-header,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
  }
}
</style>
