<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'

interface HeaderProps {
  fixed?: boolean
  class?: string
}

const props = defineProps<HeaderProps>()

// Replace React's useState with Vue's ref
const offset = ref(0)

// Replace React's useEffect with Vue's lifecycle hooks
onMounted(() => {
  const onScroll = () => {
    offset.value = document.body.scrollTop || document.documentElement.scrollTop
  }

  // Add scroll listener
  document.addEventListener('scroll', onScroll, { passive: true })

  // Clean up function
  onUnmounted(() => {
    document.removeEventListener('scroll', onScroll)
  })
})
</script>

<template>
  <header
    class="bg-background flex h-16 items-center gap-3 p-4 sm:gap-4"
    :class="[
      props.fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
      offset > 10 && props.fixed ? 'shadow-sm' : 'shadow-none',
      props.class, // Vue uses 'class' instead of 'className'
    ]"
  >
    <SidebarTrigger variant="outline" class="scale-125 sm:scale-100" />
    <Separator orientation="vertical" class="h-6" />
    <slot /> <!-- Vue's equivalent of React's children -->
  </header>
</template>
