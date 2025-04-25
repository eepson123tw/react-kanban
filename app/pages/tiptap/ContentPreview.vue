<!-- ContentPreview.vue -->
<script setup lang="ts">
interface Props {
  content: string
}

defineProps<Props>()
</script>

<template>
  <div class="content-preview border border-gray-400 p-4 rounded">
    <div class="tiptap preview-content" v-html="content" />
  </div>
</template>

<style scoped>
.content-preview {
  overflow-y: auto;
}

/* Use the same styles as in the editor to ensure consistency */
:deep(.preview-content :first-child) {
  margin-top: 0;
}

:deep(.preview-content ul),
:deep(.preview-content ol) {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

:deep(.preview-content ul li p),
:deep(.preview-content ol li p) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

:deep(.preview-content h1),
:deep(.preview-content h2),
:deep(.preview-content h3),
:deep(.preview-content h4),
:deep(.preview-content h5),
:deep(.preview-content h6) {
  line-height: 1.1;
  margin-top: 2.5rem;
  text-wrap: pretty;
}

:deep(.preview-content h1),
:deep(.preview-content h2) {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

:deep(.preview-content h1) {
  font-size: 1.4rem;
}

:deep(.preview-content h2) {
  font-size: 1.2rem;
}

:deep(.preview-content h3) {
  font-size: 1.1rem;
}

:deep(.preview-content h4),
:deep(.preview-content h5),
:deep(.preview-content h6) {
  font-size: 1rem;
}

:deep(.preview-content code) {
  background-color: var(--purple-light);
  border-radius: 0.4rem;
  color: var(--black);
  font-size: 0.85rem;
  padding: 0.25em 0.3em;
}

:deep(.preview-content pre) {
  background: var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

:deep(.preview-content pre code) {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

:deep(.preview-content mark) {
  background-color: #FAF594;
  border-radius: 0.4rem;
  box-decoration-break: clone;
  padding: 0.1rem 0.3rem;
}

:deep(.preview-content blockquote) {
  border-left: 3px solid var(--gray-3);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

:deep(.preview-content hr) {
  border: none;
  border-top: 1px solid var(--gray-2);
  margin: 2rem 0;
}
</style>
