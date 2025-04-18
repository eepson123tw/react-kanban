<script setup lang="ts">
import { GripVertical, PlusCircle, X } from 'lucide-vue-next'
import { nextTick, reactive, ref } from 'vue'

// TypeScript interfaces
interface Task {
  id: string
  title: string
  content: string
}

interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface KanbanData {
  tasks: Record<string, Task>
  columns: Record<string, Column>
  columnOrder: string[]
}

interface DraggedTask {
  taskId: string
  columnId: string
}

interface DraggedColumn {
  columnId: string
  index: number
}

interface DragOverTask {
  taskId: string
  columnId: string
}

// Initial data setup
const initialData: KanbanData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Create design mockups', content: 'Design the UI for the new feature' },
    'task-2': { id: 'task-2', title: 'Setup API endpoints', content: 'Implement REST API for user authentication' },
    'task-3': { id: 'task-3', title: 'Write tests', content: 'Create unit tests for core functionality' },
    'task-4': { id: 'task-4', title: 'Documentation', content: 'Update README and API docs' },
    'task-5': { id: 'task-5', title: 'Code review', content: 'Review PRs from team members' },
    'task-6': { id: 'task-6', title: 'Deploy to staging', content: 'Prepare staging environment for testing' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3', 'task-4'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-5', 'task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

// State management
const state = reactive<KanbanData>({ ...initialData })
const newColumnTitle = ref('')
const addingColumn = ref(false)
const newTaskData = reactive({ title: '', content: '' })
const addingTaskToColumn = ref<string | null>(null)

// Drag and drop state
const dragging = ref(false)
const draggedTask = ref<DraggedTask | null>(null)
const draggedColumn = ref<DraggedColumn | null>(null)
const dragOverColumn = ref<string | null>(null)
const dragOverTask = ref<DragOverTask | null>(null)
const dragNode = ref<HTMLElement | null>(null)

// Input refs for focus management
const newColumnInput = ref<HTMLInputElement | null>(null)
const newTaskInput = ref<HTMLInputElement | null>(null)

// Set adding column state
function setAddingColumn(value: boolean) {
  addingColumn.value = value
  if (value) {
    nextTick(() => {
      newColumnInput.value?.focus()
    })
  }
}

// Set adding task to column
function setAddingTaskToColumn(columnId: string | null) {
  addingTaskToColumn.value = columnId
  if (columnId) {
    newTaskData.title = ''
    newTaskData.content = ''
    nextTick(() => {
      newTaskInput.value?.focus()
    })
  }
}

// Handle start dragging a task
function handleDragStart(e: DragEvent, taskId: string, columnId: string) {
  if (e.dataTransfer)
    e.dataTransfer.effectAllowed = 'move'
  dragging.value = true
  draggedTask.value = { taskId, columnId }
  dragNode.value = e.target as HTMLElement

  // Add a delay to prevent the drag ghost from showing
  setTimeout(() => {
    if (dragNode.value) {
      dragNode.value.classList.add('opacity-50')
    }
  }, 0)
}

// Handle drop on a task
function handleDragEnterTask(e: DragEvent, taskId: string, columnId: string) {
  e.preventDefault()

  if (!dragging.value)
    return

  if (draggedTask.value && draggedTask.value.taskId !== taskId) {
    dragOverTask.value = { taskId, columnId }
  }
}

// Handle drop on a column
function handleDragEnterColumn(e: DragEvent, columnId: string) {
  e.preventDefault()

  if (!dragging.value)
    return

  if (draggedTask.value && draggedTask.value.columnId !== columnId) {
    dragOverColumn.value = columnId
  }

  if (draggedColumn.value && draggedColumn.value.columnId !== columnId) {
    dragOverColumn.value = columnId
  }
}

// Handle end of dragging
function handleDragEnd(e: DragEvent) {
  e.preventDefault()

  dragging.value = false

  if (dragNode.value) {
    dragNode.value.classList.remove('opacity-50')
    dragNode.value = null
  }

  // If dragging a task
  if (draggedTask.value && dragOverColumn.value) {
    // Get source and destination columns
    const sourceColumnId = draggedTask.value.columnId
    const destColumnId = dragOverColumn.value

    if (sourceColumnId !== destColumnId) {
      // Move task between columns
      const sourceColumn = state.columns[sourceColumnId]!
      const destColumn = state.columns[destColumnId]!

      // Remove task from source column
      const sourceTaskIds = Array.from(sourceColumn.taskIds)
      const taskIndex = sourceTaskIds.indexOf(draggedTask.value.taskId)
      sourceTaskIds.splice(taskIndex, 1)

      // Add task to destination column
      const destTaskIds = Array.from(destColumn.taskIds)
      if (dragOverTask.value && destColumn.id === dragOverTask.value.columnId) {
        // Insert at specific position if we're over a task
        const dropIndex = destTaskIds.indexOf(dragOverTask.value.taskId)
        destTaskIds.splice(dropIndex, 0, draggedTask.value.taskId)
      }
      else {
        // Otherwise add to the end
        destTaskIds.push(draggedTask.value.taskId)
      }

      // Update state
      state.columns[sourceColumnId]!.taskIds = sourceTaskIds
      state.columns[destColumnId]!.taskIds = destTaskIds
    }
    else if (dragOverTask.value && draggedTask.value.taskId !== dragOverTask.value.taskId) {
      // Reorder within the same column
      const column = state.columns[sourceColumnId]
      const newTaskIds = Array.from(column!.taskIds)

      // Remove from old position
      const dragIndex = newTaskIds.indexOf(draggedTask.value.taskId)
      newTaskIds.splice(dragIndex, 1)

      // Insert at new position
      const dropIndex = newTaskIds.indexOf(dragOverTask.value.taskId)
      newTaskIds.splice(dropIndex, 0, draggedTask.value.taskId)

      // Update state
      state.columns[sourceColumnId]!.taskIds = newTaskIds
    }
  }

  // If dragging a column
  if (draggedColumn.value && dragOverColumn.value && draggedColumn.value.columnId !== dragOverColumn.value) {
    const newColumnOrder = Array.from(state.columnOrder)

    // Remove from old position
    const dragIndex = newColumnOrder.indexOf(draggedColumn.value.columnId)
    newColumnOrder.splice(dragIndex, 1)

    // Insert at new position
    const dropIndex = newColumnOrder.indexOf(dragOverColumn.value)
    newColumnOrder.splice(dropIndex, 0, draggedColumn.value.columnId)

    // Update state
    state.columnOrder = newColumnOrder
  }

  // Reset drag state
  draggedTask.value = null
  draggedColumn.value = null
  dragOverColumn.value = null
  dragOverTask.value = null
}

// Add new column
function handleAddColumn() {
  if (!newColumnTitle.value.trim())
    return

  const newColumnId = `column-${Object.keys(state.columns).length + 1}-${Date.now()}`

  // Add new column to state
  state.columns[newColumnId] = {
    id: newColumnId,
    title: newColumnTitle.value,
    taskIds: [],
  }

  // Add to column order
  state.columnOrder.push(newColumnId)

  // Reset form state
  newColumnTitle.value = ''
  addingColumn.value = false
}

// Add new task
function handleAddTask(columnId: string) {
  if (!newTaskData.title.trim())
    return

  const newTaskId = `task-${Object.keys(state.tasks).length + 1}-${Date.now()}`

  // Add new task to state
  state.tasks[newTaskId] = {
    id: newTaskId,
    title: newTaskData.title,
    content: newTaskData.content,
  }

  // Add task to column
  state.columns[columnId]!.taskIds.push(newTaskId)

  // Reset form state
  newTaskData.title = ''
  newTaskData.content = ''
  addingTaskToColumn.value = null
}

// Delete column
function handleDeleteColumn(columnId: string) {
  if (!state.columns[columnId])
    return
  const taskIds = state.columns[columnId].taskIds

  // Remove tasks associated with this column
  taskIds.forEach((taskId) => {
    delete state.tasks[taskId]
  })

  // Remove the column
  delete state.columns[columnId]

  // Update column order
  state.columnOrder = state.columnOrder.filter(id => id !== columnId)
}

// Delete task
function handleDeleteTask(taskId: string) {
  // Find which column contains this task
  let columnId: string | undefined
  for (const [colId, column] of Object.entries(state.columns)) {
    if (column.taskIds.includes(taskId)) {
      columnId = colId
      break
    }
  }

  if (columnId) {
    // Remove task from column
    state.columns[columnId]!.taskIds = state.columns[columnId]!.taskIds.filter(id => id !== taskId)
    // Remove task from tasks object
    delete state.tasks[taskId]
  }
}
</script>

<template>
  <div class="flex space-x-4 overflow-x-auto pb-4 max-w-[1200px]">
    <!-- Columns -->
    <div
      v-for="(columnId) in state.columnOrder"
      :key="columnId"
      class="w-72 flex-shrink-0 bg-card rounded-md shadow"
    >
      <div class="p-3 font-semibold bg-card rounded-t-md flex justify-between items-center border-b">
        <div class="flex items-center">
          <GripVertical :size="16" class="mr-2 text-muted-foreground" />
          <span class="truncate font-medium">{{ state.columns[columnId]?.title }}</span>
          <div class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
            {{ state.columns[columnId]?.taskIds.length }}
          </div>
        </div>
        <div class="flex space-x-1">
          <button
            class="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            title="Add task"
            @click="setAddingTaskToColumn(columnId)"
          >
            <PlusCircle :size="16" />
          </button>
          <button
            class="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            title="Delete column"
            @click="handleDeleteColumn(columnId)"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <div
        class="min-h-32 p-3 max-h-[calc(100vh-250px)] overflow-y-auto"
        :class="[dragOverColumn === columnId ? 'bg-accent/20' : '']"
        draggable="true"
        @dragover.prevent
        @dragenter.prevent="handleDragEnterColumn($event, columnId)"
      >
        <!-- Tasks -->
        <div
          v-for="taskId in state.columns[columnId]?.taskIds"
          :key="taskId"
          class="p-3 mb-3 bg-card rounded-md shadow-sm cursor-move border border-border hover:shadow transition-all"
          :class="[
            draggedTask && draggedTask.taskId === taskId ? 'opacity-50' : '',
            dragOverTask && dragOverTask.taskId === taskId ? 'border-t-2 border-primary' : '',
          ]"
          draggable="true"
          @dragstart="handleDragStart($event, taskId, columnId)"
          @dragend="handleDragEnd"
          @dragover.prevent
          @dragenter.prevent="handleDragEnterTask($event, taskId, columnId)"
        >
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <GripVertical :size="14" class="mr-2 text-muted-foreground" />
              <h3 class="font-medium">
                {{ state.tasks[taskId]?.title }}
              </h3>
            </div>
            <button
              class="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
              title="Delete task"
              @click="handleDeleteTask(taskId)"
            >
              <X :size="14" />
            </button>
          </div>
          <p class="text-sm text-muted-foreground mt-2 ml-6">
            {{ state.tasks[taskId]!.content }}
          </p>
        </div>

        <!-- Add Task Form -->
        <div v-if="addingTaskToColumn === columnId" class="p-3 bg-card rounded-md shadow-md mt-3 border">
          <input
            ref="newTaskInput"
            v-model="newTaskData.title"
            type="text"
            placeholder="Task title"
            class="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
          <textarea
            v-model="newTaskData.content"
            placeholder="Task description"
            class="w-full p-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="2"
          />
          <div class="flex justify-end space-x-2">
            <button
              class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
              @click="setAddingTaskToColumn(null)"
            >
              Cancel
            </button>
            <button
              class="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              @click="handleAddTask(columnId)"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Column Button/Form -->
    <div v-if="!addingColumn" class="w-72 flex-shrink-0 bg-card/50 rounded-md shadow border border-dashed border-muted-foreground/30 flex items-center justify-center">
      <button
        class="w-full h-full p-4 text-center text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex flex-col items-center justify-center"
        @click="setAddingColumn(true)"
      >
        <PlusCircle :size="24" class="mb-2" />
        <span class="font-medium">Add New Column</span>
      </button>
    </div>
    <div v-else class="w-72 flex-shrink-0 bg-card rounded-md shadow p-4">
      <h3 class="text-lg font-medium mb-3">
        New Column
      </h3>
      <input
        ref="newColumnInput"
        v-model="newColumnTitle"
        type="text"
        placeholder="Column title"
        class="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
          @click="setAddingColumn(false)"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          @click="handleAddColumn"
        >
          Add Column
        </button>
      </div>
    </div>
  </div>
</template>
