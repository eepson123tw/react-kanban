<!-- RichTextEditorWithPreview.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import ContentPreview from './tiptap/ContentPreview.vue'
import RichTextEditor from './tiptap/RichTextEditor.vue'

// Initial content for the editor
const editorContent = ref<string>(`<h1>🚀 Project: Thor New Project</h1>
<p><strong>Status:</strong> Planning</p>
<p><strong>Priority:</strong> 🔥 Critical</p>
<!-- Additional content omitted for brevity -->
`)
</script>

<template>
  <div class="editor-container flex gap-2">
    <!-- Component Display based on active tab -->
    <RichTextEditor v-model="editorContent" class="flex-1" :max-limit="10000" />
    <ContentPreview class="flex-1" :content="editorContent" />
  </div>
</template>
