<script setup lang="ts">
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

// Define props
interface Link {
  title: string
  href: string
  isActive: boolean
  disabled?: boolean
}

interface TopNavProps {
  links: Link[]
  class?: string
}

const props = defineProps<TopNavProps>()
</script>

<template>
  <div class="md:hidden">
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger as-child>
        <Button size="icon" variant="outline">
          <!-- Replace with a Vue-compatible icon -->
          <i class="icon-menu" />
          <!-- Alternatively, if using Nuxt Icon module -->
          <!-- <Icon name="tabler:menu" /> -->
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start">
        <DropdownMenuItem
          v-for="{ title, href, isActive, disabled } in props.links"
          :key="`${title}-${href}`"
          as-child
        >
          <NuxtLink
            :to="href"
            :class="!isActive ? 'text-muted-foreground' : ''"
            :disabled="disabled"
          >
            {{ title }}
          </NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <nav
    :class="cn(
      'hidden items-center space-x-4 md:flex lg:space-x-6',
      props.class,
    )"
  >
    <NuxtLink
      v-for="{ title, href, isActive, disabled } in props.links"
      :key="`${title}-${href}`"
      :to="href"
      :disabled="disabled"
      :class="`hover:text-primary text-sm font-medium transition-colors ${isActive ? '' : 'text-muted-foreground'}`"
    >
      {{ title }}
    </NuxtLink>
  </nav>
</template>
