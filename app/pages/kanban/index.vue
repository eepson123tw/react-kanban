<script setup lang="ts">
definePageMeta({
  title: 'Kanban Board',
  description: 'Interactive drag-and-drop Kanban board',
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">
      Kanban Board
    </h1>
    <p class="text-muted-foreground mb-8">
      Drag and drop tasks between columns to manage your workflow. Add new columns and tasks as needed.
    </p>

    <KanbanBoard />
  </div>
</template>
