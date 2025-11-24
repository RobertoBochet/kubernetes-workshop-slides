<script setup lang="ts">
import { computed, PropType } from "vue"
import LightOrDark from "@slidev/client/builtin/LightOrDark.vue"

type Level = "Info" | "Warning" | "Alert"

const props = defineProps({
  level: {
    type: String as PropType<Level>,
    default: "Info"
  }
})

const classLevel = computed(() => `note-box--${props.level.toLowerCase()}`)
</script>

<template>
  <LightOrDark>
    <template #dark>
      <div :class="`note-box note-box--dark ${classLevel}`">
        <slot></slot>
      </div>
    </template>
    <template #light>
      <div :class="`note-box note-box--light ${classLevel}`">
        <slot></slot>
      </div>
    </template>
  </LightOrDark>
</template>

<style scoped>
.note-box {
  padding: 8px;
  border-radius: 4px;
  border-style: solid;
  margin: 10px 0;

  &--light {
    border-left-width: 4px;
  }
  &--light&--info {
    border-color: theme("colors.blue.600");
    background-color: theme("colors.blue.200");
  }
  &--light&--warning {
    border-color: theme("colors.orange.600");
    background-color: theme("colors.orange.200");
  }
  &--light&--alert {
    border-color: theme("colors.red.600");
    background-color: theme("colors.red.200");
  }

  &--dark {
    background-color: var(--slidev-code-background);
    border-width: 1px;
    border-left-width: 4px;
  }
  &--dark&--info {
    border-color: theme("colors.blue.600");
  }
  &--dark&--warning {
    border-color: theme("colors.orange.600");
  }
  &--dark&--alert {
    border-color: theme("colors.red.600");
  }

  * {
    background: none;
  }
  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }
}
</style>
