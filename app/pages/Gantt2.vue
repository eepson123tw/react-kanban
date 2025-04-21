<!-- eslint-disable no-console -->
// GanttChart.vue
<script setup lang="ts">
import gantt from 'dhtmlx-gantt'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

// Define TypeScript interfaces
interface GanttTask {
  id: number | string
  text: string
  start_date: Date | string
  duration: number
  progress: number
  parent?: number | string
  [key: string]: any
}

interface GanttLink {
  id: number | string
  source: number | string
  target: number | string
  type: string
  [key: string]: any
}

// Component state
const ganttContainer = ref<HTMLElement | null>(null)
const currentZoom = ref('days')
let ganttInitialized = false

// Sample data - in a real application, you might want to make these reactive and fetch from an API
const tasks = ref<GanttTask[]>([
  { id: 1, text: 'Project Initiation', start_date: '2025-04-21', duration: 3, progress: 0.6 },
  { id: 2, text: 'Requirements Analysis', start_date: '2025-04-24', duration: 5, progress: 0.3, parent: 1 },
  { id: 3, text: 'Design Phase', start_date: '2025-04-29', duration: 8, progress: 0 },
  { id: 4, text: 'Development', start_date: '2025-05-07', duration: 14, progress: 0 },
  { id: 5, text: 'Testing', start_date: '2025-05-21', duration: 7, progress: 0 },
])

const links = ref<GanttLink[]>([
  { id: 1, source: 1, target: 2, type: '0' },
  { id: 2, source: 2, target: 3, type: '0' },
  { id: 3, source: 3, target: 4, type: '0' },
  { id: 4, source: 4, target: 5, type: '0' },
])

// Initialize the Gantt chart
function initGantt() {
  if (!ganttContainer.value)
    return

  // Configure any global settings for the gantt chart
  gantt.config.date_format = '%Y-%m-%d %H:%i'

  // Initialize the gantt chart
  gantt.init(ganttContainer.value)
  ganttInitialized = true

  // Set up data parsing
  gantt.parse({ data: tasks.value, links: links.value })

  // Set up event listeners
  setupEvents()

  // Apply zoom level
  applyZoom(currentZoom.value)
}

// Set up Gantt chart events
function setupEvents() {
  // Task events
  gantt.attachEvent('onAfterTaskUpdate', (id: string, task: string) => {
    console.log('Task updated:', id, task)
    // Here you would typically update your backend
  })

  gantt.attachEvent('onAfterTaskAdd', (id: string, task: string) => {
    console.log('Task added:', id, task)
    // Here you would typically update your backend
  })

  gantt.attachEvent('onAfterTaskDelete', (id: string) => {
    console.log('Task deleted:', id)
    // Here you would typically update your backend
  })

  // Link events
  gantt.attachEvent('onAfterLinkUpdate', (id: string, link: string) => {
    console.log('Link updated:', id, link)
    // Here you would typically update your backend
  })

  gantt.attachEvent('onAfterLinkAdd', (id: string, link: string) => {
    console.log('Link added:', id, link)
    // Here you would typically update your backend
  })

  gantt.attachEvent('onAfterLinkDelete', (id: string) => {
    console.log('Link deleted:', id)
    // Here you would typically update your backend
  })
}

// Apply zoom level
function applyZoom(level: string) {
  switch (level) {
    case 'hours':
      gantt.config.scale_unit = 'hour'
      gantt.config.date_scale = '%H:%i'
      gantt.config.min_column_width = 50
      gantt.config.scale_height = 60
      break
    case 'days':
      gantt.config.scale_unit = 'day'
      gantt.config.date_scale = '%d %M'
      gantt.config.min_column_width = 70
      gantt.config.scale_height = 60
      break
    case 'months':
      gantt.config.scale_unit = 'month'
      gantt.config.date_scale = '%F, %Y'
      gantt.config.min_column_width = 120
      gantt.config.scale_height = 60
      break
    default:
      gantt.config.scale_unit = 'day'
      gantt.config.date_scale = '%d %M'
      gantt.config.min_column_width = 70
      gantt.config.scale_height = 60
  }

  if (ganttInitialized) {
    gantt.render()
  }
}

// Zoom control function
function setZoom(zoom: string) {
  currentZoom.value = zoom
}

// Watch for changes in data and zoom level
watch(() => tasks.value, (newTasks) => {
  if (ganttInitialized) {
    gantt.clearAll()
    gantt.parse({ data: newTasks, links: links.value })
  }
}, { deep: true })

watch(() => links.value, (newLinks) => {
  if (ganttInitialized) {
    gantt.clearAll()
    gantt.parse({ data: tasks.value, links: newLinks })
  }
}, { deep: true })

watch(() => currentZoom.value, (newZoom) => {
  applyZoom(newZoom)
})

// Lifecycle hooks
onMounted(() => {
  initGantt()
})

onBeforeUnmount(() => {
  if (ganttInitialized) {
    gantt.clearAll()
    // Remove all event listeners
    gantt.detachAllEvents()
  }
})
</script>

<template>
  <div class="gantt-page">
    <h1>Project Timeline</h1>

    <div class="zoom-controls">
      <button @click="setZoom('hours')">
        Hours
      </button>
      <button @click="setZoom('days')">
        Days
      </button>
      <button @click="setZoom('months')">
        Months
      </button>
    </div>

    <div class="gantt-container">
      <div ref="ganttContainer" class="gantt-chart" />
    </div>
  </div>
</template>

<style scoped>
.gantt-page {
  padding: 20px;
}

.zoom-controls {
  margin-bottom: 15px;
}

.zoom-controls button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.zoom-controls button:hover {
  background-color: #e0e0e0;
}

.gantt-container {
  height: 500px;
  width: 100%;
}

.gantt-chart {
  height: 100%;
  width: 100%;
}
</style>
