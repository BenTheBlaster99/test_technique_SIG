<script setup lang="ts">
import type { Commentaire } from '../types/models'

defineProps<{
  comments: Commentaire[]
}>()

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
</script>

<template>
  <section class="comment-list">
    <div class="section-heading">
      <h2>Comments</h2>
      <span>{{ comments.length }} total</span>
    </div>

    <p v-if="comments.length === 0" class="empty-copy">
      No recruiter comments yet.
    </p>

    <article v-for="comment in comments" :key="comment.id" class="comment-card">
      <div class="comment-meta">
        <strong>{{ comment.auteur }}</strong>
        <span>{{ formatDate(comment.date) }}</span>
      </div>

      <p>{{ comment.contenu }}</p>
    </article>
  </section>
</template>

<style scoped>
.comment-list {
  display: grid;
  gap: 1rem;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading h2 {
  margin: 0;
}

.section-heading span,
.empty-copy {
  color: var(--muted-color);
}

.comment-card {
  display: grid;
  gap: 0.65rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.comment-card p {
  line-height: 1.6;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.comment-meta span {
  color: var(--muted-color);
}

@media (max-width: 560px) {
  .comment-meta {
    flex-direction: column;
  }
}
</style>
