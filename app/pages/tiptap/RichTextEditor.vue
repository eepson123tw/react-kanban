<!-- RichTextEditor.vue -->
<script setup lang="ts">
import type { Level } from '@tiptap/extension-heading'
import CharacterCount from '@tiptap/extension-character-count'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, Editor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Delete,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Star,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-vue-next'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface TextAction {
  slug: string
  icon: any
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

// Main toolbar actions
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
  { slug: 'aiGen', icon: Star, active: 'aiGen' },
])

// Bubble menu actions (appears when text is selected)
const bubbleMenuActions = ref<TextAction[]>([
  { slug: 'bold', icon: Bold, active: 'bold' },
  { slug: 'italic', icon: Italic, active: 'italic' },
  { slug: 'underline', icon: UnderlineIcon, active: 'underline' },
  { slug: 'strike', icon: Strikethrough, active: 'strike' },
  { slug: 'code', icon: Code, active: 'code' },
])

// Floating menu actions for headings and block types
const floatingMenuActions = ref([
  { slug: 'heading1', icon: Heading1, active: { heading: { level: 1 } }, label: 'Heading 1' },
  { slug: 'heading2', icon: Heading2, active: { heading: { level: 2 } }, label: 'Heading 2' },
  { slug: 'heading3', icon: Heading3, active: { heading: { level: 3 } }, label: 'Heading 3' },
  { slug: 'paragraph', icon: Pilcrow, active: 'paragraph', label: 'Paragraph' },
  { slug: 'bulletList', icon: List, active: 'bulletList', label: 'Bullet List' },
  { slug: 'orderedList', icon: ListOrdered, active: 'orderedList', label: 'Ordered List' },
  { slug: 'blockquote', icon: Quote, active: 'blockquote', label: 'Quote' },
])

const shortcutsList = ref([
  { command: 'Ctrl/Cmd + B', description: 'Bold' },
  { command: 'Ctrl/Cmd + I', description: 'Italic' },
  { command: 'Ctrl/Cmd + U', description: 'Underline' },
  { command: 'Ctrl/Cmd + Shift + S', description: 'Strikethrough' },
  { command: 'Ctrl/Cmd + Shift + M', description: 'Code' },
  { command: 'Ctrl/Cmd + Alt + 1-6', description: 'Heading 1-6' },
  { command: 'Ctrl/Cmd + Shift + 7', description: 'Ordered List' },
  { command: 'Ctrl/Cmd + Shift + 8', description: 'Bullet List' },
  { command: 'Ctrl/Cmd + Shift + Q', description: 'Blockquote' },
  { command: 'Ctrl/Cmd + Z', description: 'Undo' },
  { command: 'Ctrl/Cmd + Shift + Z', description: 'Redo' },
])

const showShortcuts = ref(false)

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
    emit('update:modelValue', contentHTML.value)
  }
}

function onActionClick(slug: string, option: string | null = null) {
  if (!editor.value)
    return

  const vm = editor.value.chain().focus()

  type ActionKey = 'bold' | 'italic' | 'underline' | 'strike' | 'bulletList' | 'orderedList' |
    'align' | 'subscript' | 'superscript' | 'undo' | 'redo' | 'clear' | 'code' |
    'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'blockquote' | 'aiGen'

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
    code: () => vm.toggleCode().run(),
    heading1: () => vm.toggleHeading({ level: 1 }).run(),
    heading2: () => vm.toggleHeading({ level: 2 }).run(),
    heading3: () => vm.toggleHeading({ level: 3 }).run(),
    paragraph: () => vm.setParagraph().run(),
    blockquote: () => vm.toggleBlockquote().run(),
    aiGen: () => {
      if (!editor.value)
        return

      const { empty: selectionIsEmpty, from: selectionFrom, to: selectionTo } = editor.value.state.selection

      const selectionContainsText = selectionIsEmpty || editor.value.state.doc.textBetween(selectionFrom, selectionTo, ' ')

      if (!selectionIsEmpty) {
        // Replace selected text with new content
        editor.value.chain()
          .focus()
          .deleteRange({ from: selectionFrom, to: selectionTo })
          .insertContent(`${selectionContainsText}aaaaaaaaaaaaaaa`)
          .run()
      }
      else {
        // Insert at current position if no text is selected
        editor.value.chain()
          .focus()
          .insertContent('aaaaaaaaaaaaaaa')
          .run()
      }
    },
  }

  if (slug in actionTriggers) {
    actionTriggers[slug as ActionKey]()
  }
}

function onHeadingClick(index: number) {
  if (!editor.value)
    return

  const vm = editor.value.chain().focus()
  vm.toggleHeading({ level: index as Level }).run()
}

function onFloatingMenuAction(slug: string) {
  onActionClick(slug)
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
    content: props.modelValue,
    extensions: [
      StarterKit.configure({
        // Configure any StarterKit options here
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Customize keyboard shortcuts here if needed
      }),
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
    },
    // Enable keyboard shortcuts for the editor
    editorProps: {
      attributes: {
        class: 'outline-none',
      },
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
  <div class="">
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

      <!-- Keyboard shortcuts button -->
      <Button
        variant="outline"
        size="icon"
        class="ml-2 my-2"
        @click="showShortcuts = !showShortcuts"
      >
        ⌨️
      </Button>
    </div>

    <!-- Keyboard Shortcuts Modal -->
    <div v-if="showShortcuts" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-96 max-w-lg">
        <div class="flex justify-between items-center border-b p-4">
          <h3 class="text-lg font-semibold">
            Keyboard Shortcuts
          </h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showShortcuts = false">
            ✕
          </button>
        </div>
        <div class="p-4 max-h-96 overflow-y-auto">
          <table class="w-full">
            <tbody>
              <tr v-for="(shortcut, index) in shortcutsList" :key="index" class="border-b last:border-b-0">
                <td class="py-2 pr-4 font-mono text-sm">
                  {{ shortcut.command }}
                </td>
                <td class="py-2">
                  {{ shortcut.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t p-4 text-right">
          <Button variant="outline" @click="showShortcuts = false">
            Close
          </Button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <EditorContent :editor="editor" class="overflow-y-auto h-[300px] outline-none" />

    <!-- Bubble Menu - Appears when text is selected -->
    <BubbleMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }">
      <div class="bg-white border border-gray-300 shadow-lg rounded-md p-1 flex">
        <button
          v-for="{ slug, icon, active } in bubbleMenuActions"
          :key="slug"
          :class="{ 'bg-gray-800 text-white': editor.isActive(active) }"
          class="p-1.5 rounded-md hover:bg-gray-100 mx-0.5"
          @click="onActionClick(slug)"
        >
          <component :is="icon" class="w-4 h-4" />
        </button>
      </div>
    </BubbleMenu>

    <!-- Floating Menu - Appears at the beginning of empty paragraphs -->
    <FloatingMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100, placement: 'left' }">
      <div class="bg-white border border-gray-300 shadow-lg rounded-md p-2">
        <div class="space-y-1">
          <button
            v-for="{ slug, icon, label, active } in floatingMenuActions"
            :key="slug"
            :class="{ 'bg-gray-800 text-white': editor.isActive(active) }"
            class="flex items-center p-1.5 rounded-md hover:bg-gray-100 w-full"
            @click="onFloatingMenuAction(slug)"
          >
            <component :is="icon" class="w-4 h-4 mr-2" />
            <span class="text-sm">{{ label }}</span>
          </button>
        </div>
      </div>
    </FloatingMenu>

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

:deep(.tiptap) {
  /* Base styles for editor content */
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul, ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;
  }

  ul li p, ol li p {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }

  /* Heading styles */
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1, h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4, h5, h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: rgba(#616161, 0.1);
    border-radius: 0.4rem;
    color: #616161;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: #0D0D0D;
    border-radius: 0.5rem;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;
  }

  pre code {
    background: none;
    color: inherit;
    font-size: 0.8rem;
    padding: 0;
  }

  blockquote {
    border-left: 3px solid #0D0D0D;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
</style>
