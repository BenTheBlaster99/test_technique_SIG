<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return
  }

  emit('change', page)
}
</script>

<template>
  <nav class="pagination" aria-label="Pagination">
    <button type="button" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
      Previous
    </button>

    <span class="page-copy">Page {{ currentPage }} of {{ totalPages }}</span>

    <button type="button" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
      Next
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--surface-color);
}

.page-copy {
  color: var(--muted-color);
  font-weight: 600;
}

@media (max-width: 560px) {
  .pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .page-copy {
    text-align: center;
  }
}
</style>
