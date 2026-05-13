<script setup lang="ts">
import { computed, PropType } from "vue"

type NoteBoxType = "Info" | "Warning" | "Alert" | "Success" | "Failure" | "Neutral"

const { type, class: _class } = defineProps({
  class: { type: String, default: "" },
  type: {
    type: String as PropType<NoteBoxType>,
    required: false,
    default: "Info"
  }
})

const classType = computed(() => `note-box--${type?.toLowerCase() ?? "neutral"}`)
</script>

<template>
  <div :class="['note-box', classType, _class]">
    <slot></slot>
  </div>
</template>

<style scoped>
.note-box {
  padding: 8px;
  border-radius: 4px;
  border-style: solid;
  margin: 10px 0;
  font-size: 0.8em;

  @apply border-l-4 dark:border-1 dark:border-l-4;

  &--neutral {
    border-color: theme("colors.gray.600");
    background-color: light-dark(theme("colors.gray.200"), var(--slidev-code-background));
  }
  &--info {
    border-color: theme("colors.blue.600");
    background-color: light-dark(theme("colors.blue.200"), var(--slidev-code-background));
  }
  &--warning {
    border-color: theme("colors.orange.600");
    background-color: light-dark(theme("colors.orange.200"), var(--slidev-code-background));
  }
  &--alert,
  &--failure {
    border-color: theme("colors.red.600");
    background-color: light-dark(theme("colors.red.200"), var(--slidev-code-background));
  }
  &--success {
    border-color: theme("colors.green.600");
    background-color: light-dark(theme("colors.green.200"), var(--slidev-code-background));
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
