<script setup lang="ts">
import { computed, PropType } from "vue"

const sizes = {
  sm: "1rem",
  md: "2rem",
  xl: "4rem",
  xxl: "6rem"
} as const

const props = defineProps({
  size: {
    type: String as PropType<keyof typeof sizes>,
    default: "sm"
  }
})

const style = computed(() => ({ height: sizes[props.size] }))
</script>

<template>
  <div :style="style" />
</template>
