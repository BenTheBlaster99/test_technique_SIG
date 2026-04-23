<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps<{
  isSaving: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { auteur: string; contenu: string }]
}>()

const form = reactive({
  auteur: 'Hiring Team',
  contenu: '',
})

function handleSubmit() {
  if (!form.auteur.trim() || !form.contenu.trim()) {
    return
  }

  emit('submit', {
    auteur: form.auteur.trim(),
    contenu: form.contenu.trim(),
  })

  form.contenu = ''
}
</script>

<template>
  <form class="comment-form" @submit.prevent="handleSubmit">
    <div class="section-heading">
      <h2>Add a comment</h2>
      <span>Saved to the JSON Server record</span>
    </div>

    <label class="field">
      <span>Author</span>
      <input v-model="form.auteur" type="text" placeholder="Your name" />
    </label>

    <label class="field">
      <span>Comment</span>
      <textarea
        v-model="form.contenu"
        rows="4"
        placeholder="Write a short recruiting note..."
      />
    </label>

    <button type="submit" :disabled="props.isSaving">
      {{ props.isSaving ? 'Saving...' : 'Save comment' }}
    </button>
  </form>
</template>

<style scoped>
.comment-form {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
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

.section-heading span {
  color: var(--muted-color);
}

.field {
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
}

.field span {
  color: var(--muted-color);
  font-size: 0.9rem;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.75rem 0.85rem;
  border-radius: 0.8rem;
  border: 1px solid var(--border-color);
  background: var(--input-color);
  color: var(--heading-color);
  font: inherit;
  box-sizing: border-box;
  resize: vertical;
}

@media (max-width: 560px) {
  .section-heading {
    flex-direction: column;
  }
}
</style>
