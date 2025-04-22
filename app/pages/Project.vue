<script setup lang="ts">
import { Check, PlusCircle, Save, X } from 'lucide-vue-next'
import { reactive, ref } from 'vue'

import { Alert, AlertDescription } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
// Import shadcn components
import { Button } from '~/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'

// Define types
interface Goal {
  id: number
  text: string
  completed: boolean
}

interface TeamMember {
  id: number
  name: string
  role: string
}

interface ProjectResource {
  id: number
  name: string
  type: string
  link?: string
}

interface ProjectFormData {
  name: string
  description: string
  status: string
  priority: string
  category: string
  goals: Goal[]
  teamMembers: TeamMember[]
  resources: ProjectResource[]
  budget: number | undefined
  isPublic: boolean
  tags: string[]
}

// Dummy data for dropdowns
const categories = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Data Analysis',
  'Machine Learning',
  'DevOps',
  'Marketing',
  'Research',
]

const statuses = [
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
  'Cancelled',
]

const priorities = [
  'Low',
  'Medium',
  'High',
  'Critical',
]

const resourceTypes = [
  'Document',
  'Image',
  'Video',
  'Code Repository',
  'Website',
  'Other',
]

// Form state
const formData = reactive<ProjectFormData>({
  name: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  category: '',
  goals: [],
  teamMembers: [],
  resources: [],
  budget: undefined,
  isPublic: false,
  tags: [],
})

// UI state
const activeTab = ref('details')
const newGoal = ref('')
const newTagInput = ref('')
const newMemberName = ref('')
const newMemberRole = ref('')
const newResourceName = ref('')
const newResourceType = ref('')
const newResourceLink = ref('')
const isSaving = ref(false)
const showSuccessAlert = ref(false)

// Form methods
function addGoal() {
  if (newGoal.value.trim()) {
    formData.goals.push({
      id: Date.now(),
      text: newGoal.value.trim(),
      completed: false,
    })
    newGoal.value = ''
  }
}

function removeGoal(id: number) {
  formData.goals = formData.goals.filter(goal => goal.id !== id)
}

function toggleGoalCompletion(id: number) {
  const goal = formData.goals.find(g => g.id === id)
  if (goal) {
    goal.completed = !goal.completed
  }
}

function addTag() {
  const tag = newTagInput.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTagInput.value = ''
  }
}

function removeTag(tag: string) {
  formData.tags = formData.tags.filter(t => t !== tag)
}

function addTeamMember() {
  if (newMemberName.value.trim() && newMemberRole.value.trim()) {
    formData.teamMembers.push({
      id: Date.now(),
      name: newMemberName.value.trim(),
      role: newMemberRole.value.trim(),
    })
    newMemberName.value = ''
    newMemberRole.value = ''
  }
}

function removeTeamMember(id: number) {
  formData.teamMembers = formData.teamMembers.filter(member => member.id !== id)
}

function addResource() {
  if (newResourceName.value.trim() && newResourceType.value) {
    formData.resources.push({
      id: Date.now(),
      name: newResourceName.value.trim(),
      type: newResourceType.value,
      link: newResourceLink.value.trim() || undefined,
    })
    newResourceName.value = ''
    newResourceType.value = ''
    newResourceLink.value = ''
  }
}

function removeResource(id: number) {
  formData.resources = formData.resources.filter(resource => resource.id !== id)
}

async function saveProject() {
  isSaving.value = true

  // Here you would typically send the data to your API
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1500))

    // console.log('Project data saved:', formData)
    showSuccessAlert.value = true

    // Hide success message after a few seconds
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }
  catch (error) {
    console.error('Error saving project:', error)
  }
  finally {
    isSaving.value = false
  }
}

// No date formatting needed without date fields
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <form @submit.prevent="saveProject">
      <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col space-y-1.5">
          <h2 class="text-3xl font-bold tracking-tight">
            Create New Project
          </h2>
          <p class="text-muted-foreground">
            Fill in the details to set up your new project.
          </p>
        </div>

        <!-- Success Alert -->
        <Alert v-if="showSuccessAlert" class="bg-green-50 border-green-200">
          <Check class="h-4 w-4 text-green-600" />
          <AlertDescription class="text-green-800">
            Project saved successfully!
          </AlertDescription>
        </Alert>

        <!-- Main Form Content -->
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger value="details">
              Project Details
            </TabsTrigger>
            <TabsTrigger value="goals">
              Goals
            </TabsTrigger>
            <TabsTrigger value="team">
              Team & Resources
            </TabsTrigger>
            <TabsTrigger value="settings">
              Settings
            </TabsTrigger>
          </TabsList>

          <!-- Project Details Tab -->
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Define the core details of your project.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Project Name -->
                <div class="space-y-2">
                  <Label for="project-name" class="text-sm font-medium">Project Name <span class="text-red-500">*</span></Label>
                  <Input
                    id="project-name"
                    v-model="formData.name"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <!-- Project Description -->
                <div class="space-y-2">
                  <Label for="description" class="text-sm font-medium">Description <span class="text-red-500">*</span></Label>
                  <Textarea
                    id="description"
                    v-model="formData.description"
                    placeholder="Describe your project's purpose and objectives"
                    rows="5"
                    required
                  />
                </div>

                <!-- Project Category -->
                <div class="space-y-2">
                  <Label for="category" class="text-sm font-medium">Category</Label>
                  <Select v-model="formData.category">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Status -->
                  <div class="space-y-2">
                    <Label for="status" class="text-sm font-medium">Status</Label>
                    <Select v-model="formData.status">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="status in statuses" :key="status" :value="status">
                          {{ status }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <!-- Priority -->
                  <div class="space-y-2">
                    <Label for="priority" class="text-sm font-medium">Priority</Label>
                    <Select v-model="formData.priority">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="priority in priorities" :key="priority" :value="priority">
                          {{ priority }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- Date fields removed to avoid type issues -->
                <div class="border p-4 rounded-md bg-gray-50">
                  <p class="text-sm text-gray-500">
                    Date selection fields have been removed for simplicity. You can add custom date fields later if needed.
                  </p>
                </div>

                <!-- Tags -->
                <div class="space-y-2">
                  <Label class="text-sm font-medium">Tags</Label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <Badge
                      v-for="tag in formData.tags"
                      :key="tag"
                      variant="secondary"
                      class="flex items-center gap-1"
                    >
                      {{ tag }}
                      <button type="button" class="text-muted-foreground hover:text-foreground" @click="() => removeTag(tag)">
                        <X class="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                  <div class="flex gap-2">
                    <Input
                      v-model="newTagInput"
                      placeholder="Add a tag"
                      @keyup.enter.prevent="addTag"
                    />
                    <Button type="button" variant="outline" @click="addTag">
                      <PlusCircle class="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <!-- Budget -->
                <div class="space-y-2">
                  <Label for="budget" class="text-sm font-medium">Budget</Label>
                  <Input
                    id="budget"
                    v-model="formData.budget"
                    type="number"
                    placeholder="Enter budget amount"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Goals Tab -->
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Project Goals</CardTitle>
                <CardDescription>
                  Define what you aim to achieve with this project.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Add Goal -->
                <div class="flex gap-2">
                  <Input
                    v-model="newGoal"
                    placeholder="Add a project goal"
                    @keyup.enter.prevent="addGoal"
                  />
                  <Button type="button" @click="addGoal">
                    Add Goal
                  </Button>
                </div>

                <!-- Goals List -->
                <div class="space-y-2">
                  <div
                    v-for="goal in formData.goals"
                    :key="goal.id"
                    class="flex items-center justify-between p-3 rounded-md border"
                    :class="goal.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'"
                  >
                    <div class="flex items-center gap-3">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        @click="() => toggleGoalCompletion(goal.id)"
                      >
                        <Check
                          :class="goal.completed ? 'opacity-100 text-green-600' : 'opacity-20'"
                          class="h-5 w-5"
                        />
                      </Button>
                      <span :class="goal.completed ? 'line-through text-gray-500' : ''">{{ goal.text }}</span>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      @click="() => removeGoal(goal.id)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>

                  <div v-if="formData.goals.length === 0" class="text-center py-8 text-gray-500">
                    No goals added yet. Add some goals to track your project objectives.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Team & Resources Tab -->
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members & Resources</CardTitle>
                <CardDescription>
                  Add team members and resources for your project.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Team Members Section -->
                <div class="space-y-4">
                  <h3 class="font-medium text-lg">
                    Team Members
                  </h3>

                  <!-- Add Team Member -->
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      v-model="newMemberName"
                      placeholder="Name"
                    />
                    <Input
                      v-model="newMemberRole"
                      placeholder="Role"
                    />
                    <Button type="button" @click="addTeamMember">
                      Add Member
                    </Button>
                  </div>

                  <!-- Team Members List -->
                  <div class="space-y-2">
                    <div
                      v-for="member in formData.teamMembers"
                      :key="member.id"
                      class="flex items-center justify-between p-3 rounded-md border border-gray-200"
                    >
                      <div>
                        <div class="font-medium">
                          {{ member.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ member.role }}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        @click="() => removeTeamMember(member.id)"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <div v-if="formData.teamMembers.length === 0" class="text-center py-4 text-gray-500">
                      No team members added yet.
                    </div>
                  </div>
                </div>

                <!-- Resources Section -->
                <div class="space-y-4">
                  <h3 class="font-medium text-lg">
                    Resources
                  </h3>

                  <!-- Add Resource -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      v-model="newResourceName"
                      placeholder="Resource name"
                    />
                    <Select v-model="newResourceType">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="type in resourceTypes" :key="type" :value="type">
                          {{ type }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="flex gap-2">
                    <Input
                      v-model="newResourceLink"
                      placeholder="Resource link (optional)"
                    />
                    <Button type="button" @click="addResource">
                      Add
                    </Button>
                  </div>

                  <!-- Resources List -->
                  <div class="space-y-2">
                    <div
                      v-for="resource in formData.resources"
                      :key="resource.id"
                      class="flex items-center justify-between p-3 rounded-md border border-gray-200"
                    >
                      <div>
                        <div class="font-medium">
                          {{ resource.name }}
                        </div>
                        <div class="flex items-center gap-2">
                          <Badge>{{ resource.type }}</Badge>
                          <a
                            v-if="resource.link"
                            :href="resource.link"
                            target="_blank"
                            class="text-sm text-blue-600 hover:underline"
                          >
                            View Link
                          </a>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        @click="() => removeResource(resource.id)"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <div v-if="formData.resources.length === 0" class="text-center py-4 text-gray-500">
                      No resources added yet.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <!-- Settings Tab -->
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>
                  Configure additional settings for your project.
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <!-- Visibility Setting -->
                <div class="flex items-center justify-between space-y-2">
                  <div>
                    <Label class="text-base">Project Visibility</Label>
                    <p class="text-sm text-muted-foreground">
                      Make this project visible to everyone in the organization
                    </p>
                  </div>
                  <Switch v-model="formData.isPublic" />
                </div>

                <div class="border-t pt-4">
                  <p class="text-sm text-muted-foreground">
                    Additional settings will be available after project creation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <!-- Form Actions -->
        <div class="flex justify-between">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  type="submit"
                  :disabled="isSaving || !formData.name || !formData.description"
                >
                  <Save class="mr-2 h-4 w-4" />
                  {{ isSaving ? 'Saving...' : 'Save Project' }}
                </Button>
              </TooltipTrigger>
              <TooltipContent v-if="!formData.name || !formData.description">
                Please fill in all required fields
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  </div>
</template>
