<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'
import CharacterCount from '@tiptap/extension-character-count'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Delete,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TextAction {
  slug: string
  icon: any // Change to any to support Lucide component
  active: string | { [key: string]: string }
  option?: string
}

interface Props {
  modelValue?: string
  maxLimit?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxLimit: 4000,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editor = ref<Editor>()
const contentHTML = ref<string>('')
const viewMode = ref<'html' | 'json'>('html')

const textActions = ref<TextAction[]>([
  { slug: 'bold', icon: Bold, active: 'bold' },
  { slug: 'italic', icon: Italic, active: 'italic' },
  { slug: 'underline', icon: UnderlineIcon, active: 'underline' },
  { slug: 'strike', icon: Strikethrough, active: 'strike' },
  { slug: 'align', option: 'left', icon: AlignLeft, active: { textAlign: 'left' } },
  { slug: 'align', option: 'center', icon: AlignCenter, active: { textAlign: 'center' } },
  { slug: 'align', option: 'right', icon: AlignRight, active: { textAlign: 'right' } },
  { slug: 'align', option: 'justify', icon: AlignJustify, active: { textAlign: 'justify' } },
  { slug: 'bulletList', icon: List, active: 'bulletList' },
  { slug: 'orderedList', icon: ListOrdered, active: 'orderedList' },
  { slug: 'subscript', icon: SubscriptIcon, active: 'subscript' },
  { slug: 'superscript', icon: SuperscriptIcon, active: 'superscript' },
  { slug: 'undo', icon: Undo, active: 'undo' },
  { slug: 'redo', icon: Redo, active: 'redo' },
  { slug: 'clear', icon: Delete, active: 'clear' },
])

const charactersCount = computed(() => {
  return editor.value?.storage?.characterCount?.characters?.() || 0
})

const wordsCount = computed(() => {
  return editor.value?.storage?.characterCount?.words?.() || 0
})

const contentJSON = computed(() => {
  if (editor.value) {
    return JSON.stringify(editor.value.getJSON(), null, 2)
  }
  return '{}'
})

// Update content when editor changes
function updateContent() {
  if (editor.value) {
    contentHTML.value = editor.value.getHTML()
  }
}

function onActionClick(slug: string, option: string | null = null) {
  if (!editor.value)
    return

  const vm = editor.value.chain().focus()

  type ActionKey = 'bold' | 'italic' | 'underline' | 'strike' | 'bulletList' | 'orderedList' |
    'align' | 'subscript' | 'superscript' | 'undo' | 'redo' | 'clear'

  const actionTriggers: Record<ActionKey, () => void> = {
    bold: () => vm.toggleBold().run(),
    italic: () => vm.toggleItalic().run(),
    underline: () => vm.toggleUnderline().run(),
    strike: () => vm.toggleStrike().run(),
    bulletList: () => vm.toggleBulletList().run(),
    orderedList: () => vm.toggleOrderedList().run(),
    align: () => {
      if (option) {
        vm.setTextAlign(option).run()
      }
    },
    subscript: () => vm.toggleSubscript().run(),
    superscript: () => vm.toggleSuperscript().run(),
    undo: () => vm.undo().run(),
    redo: () => vm.redo().run(),
    clear: () => {
      vm.clearNodes().run()
      vm.unsetAllMarks().run()
    },
  }

  // Now we can safely check if the slug is a valid action key
  if (slug in actionTriggers) {
    actionTriggers[slug as ActionKey]()
  }
}

function onHeadingClick(index: number) {
  if (!editor.value)
    return

  const vm = editor.value.chain().focus()
  // Cast the number to Level type (which is a union of 1 | 2 | 3 | 4 | 5 | 6)
  vm.toggleHeading({ level: index as Level }).run()
}

watch(() => props.modelValue, (value) => {
  if (!editor.value)
    return
  if (editor.value.getHTML() === value)
    return

  editor.value.commands.setContent(value, false)
})

onMounted(() => {
  editor.value = new Editor({
    content: `<h1>🚀 Project: Thor New Project</h1>
<p><strong>Status:</strong> Planning</p>
<p><strong>Priority:</strong> 🔥 Critical</p>
<p><strong>Category:</strong> Marketing</p>
<p><strong>Visibility:</strong> Public</p>
<p><strong>Tags:</strong> #need-help</p>

<h2>📝 Description</h2>
<p>Our mission is to build a strong, valuable project within two months. This project focuses on marketing innovation, and we'll be conducting interviews to validate ideas and collect feedback.</p>

<h2>🎯 Goals & Milestones</h2>
<ul>
  <li><strong>⏳ Timeline:</strong> 2 months – set key check-ins every 2 weeks.</li>
  <li><strong>🔍 Deep Research:</strong> Dive into the target audience, competitor analysis, and content strategy.</li>
  <li><strong>🎤 Interview Task:</strong> Identify and reach out to at least 5 relevant interviewees (marketers, users, or experts) to understand needs and refine direction.</li>
</ul>

<h2>👥 Team Members</h2>
<ul>
  <li><strong>Aaron</strong> – Developer</li>
  <li><strong>Jirong</strong> – Developer</li>
  <li><strong>YK</strong> – Project Manager</li>
</ul>

<h2>💰 Budget</h2>
<p>💸 <strong>Budget:</strong> 1 unit (Consider specifying the currency and what "1" represents — is this symbolic or literal?)</p>

<h2>🧭 Action Guide</h2>
<ol>
  <li><strong>Kick-off Meeting:</strong> Align on objectives, assign research areas.</li>
  <li><strong>Interview Planning:</strong>
    <ul>
      <li>Define interview objectives (e.g., understand pain points, validate features).</li>
      <li>Make a list of potential interviewees.</li>
      <li>Prepare a semi-structured interview script.</li>
    </ul>
  </li>
  <li><strong>Project Plan Draft:</strong> Timeline, roles, delivery goals.</li>
  <li><strong>Design Initial Assets:</strong> Landing page, deck, branding rough draft.</li>
  <li><strong>Progress Reviews:</strong> Weekly standups and mid-project retrospective.</li>
</ol>

<h2>📌 Suggestions</h2>
<ul>
  <li>Consider naming the project more specifically (e.g., “Thor Marketing Sprint Q2”).</li>
  <li>Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound.</li>
  <li>Add a section for risks or blockers to preemptively manage issues.</li>
</ul>
`,
    extensions: [
      StarterKit,
      Underline,
      Subscript,
      Superscript,
      CharacterCount.configure({
        limit: props.maxLimit || undefined,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    onUpdate: () => {
      updateContent()
      emit('update:modelValue', editor.value?.getHTML() || '')
    },
  })
  updateContent()
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <!-- Remove link to Remix icons since we're using Lucide instead -->
  <div class="border border-gray-400">
    <div v-if="editor" class="flex items-center flex-wrap border-b border-gray-400">
      <div class="relative inline-block mx-2 my-2 group">
        <Button variant="outline" class="h-8">
          Heading ▼
        </Button>
        <div class="hidden absolute left-0 right-0 border border-gray-800 outline-1 outline-white rounded bg-white z-10 group-hover:block">
          <a
            v-for="index in 6"
            :key="index"
            :class="{ 'bg-gray-800 text-white': editor.isActive('heading', { level: index }) }"
            :style="{ fontSize: `${20 - index}px` }"
            class="block py-1.5 px-3 text-center cursor-pointer hover:bg-gray-800 hover:text-white"
            role="button"
            @click="onHeadingClick(index)"
          >
            H{{ index }}
          </a>
        </div>
      </div>

      <Button
        v-for="{ slug, option, active, icon } in textActions"
        :key="`${slug}-${option || ''}`"
        variant="outline"
        size="icon"
        :class="{ 'bg-gray-800 text-white': editor.isActive(active) }"
        class="mx-1 my-2"
        @click="onActionClick(slug, option)"
      >
        <component :is="icon" class="w-4 h-4" />
      </Button>
    </div>

    <EditorContent :editor="editor" class="overflow-y-auto h-[300px] outline-none" />

    <div v-if="editor" class="text-gray-500 text-sm text-right p-1.5">
      <span
        :class="{
          'text-orange-500': charactersCount >= maxLimit - 20 && charactersCount < maxLimit,
          'text-red-500': maxLimit && charactersCount === maxLimit,
        }"
      >
        {{ charactersCount }} {{ maxLimit ? `/ ${maxLimit} characters` : 'characters' }}
      </span>
      |
      <span>
        {{ wordsCount }} words
      </span>
    </div>
    <!-- Content Structure Viewer -->
    <div class="mt-6">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium text-lg">
          Content Structure
        </h3>
        <div class="flex space-x-2">
          <button
            :class="{ 'bg-blue-600 text-white': viewMode === 'html', 'bg-gray-200': viewMode !== 'html' }"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
            @click="viewMode = 'html'"
          >
            HTML
          </button>
          <button
            :class="{ 'bg-blue-600 text-white': viewMode === 'json', 'bg-gray-200': viewMode !== 'json' }"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
            @click="viewMode = 'json'"
          >
            JSON
          </button>
        </div>
      </div>

      <div class="bg-gray-100 rounded-lg p-4 overflow-auto max-h-64 font-mono text-sm">
        <pre v-if="viewMode === 'html'" class="whitespace-pre-wrap">{{ contentHTML }}</pre>
        <pre v-else class="whitespace-pre-wrap">{{ contentJSON }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.tiptap.ProseMirror){
  width: 100%;
  height: 600px;
  padding: 10px;
}
</style>
<!-- https://github.com/ueberdosis/tiptap-ui-components/tree/main/apps/web/src/components/tiptap-templates/simple -->
