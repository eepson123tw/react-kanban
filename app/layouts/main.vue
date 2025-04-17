<script setup lang="ts">
interface MainProps {
  fixed?: boolean
  class?: string
}

// Define props
const props = defineProps<MainProps>()
</script>

<template>
  <main
    class="peer-[.header-fixed]/header:mt-16 px-4 py-6"
    :class="[
      props.fixed && 'fixed-main flex grow flex-col overflow-hidden',
      props.class,
    ]"
  >
    <slot />
  </main>
</template>
