<script setup lang="ts">
defineProps<{
  label: string
  color?: string
}>()
</script>

<template>
  <span
    class="status-badge"
    :style="{
      '--badge-color': color ?? '#64748b',
    }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.status-badge {
  --badge-color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--badge-color);
  background: color-mix(in srgb, var(--badge-color) 14%, white);
  border: 1px solid color-mix(in srgb, var(--badge-color) 35%, white);
}
</style>
