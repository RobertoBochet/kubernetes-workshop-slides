<script setup lang="ts">
import { computed, PropType } from "vue"
import NoteBox from "./note-box.vue"
import Label from "./label.vue"

type LabelsProp = (string | [string, string])[]

const { name, labels, link } = defineProps({
  name: {
    type: String,
    required: true
  },
  labels: {
    type: Array as PropType<LabelsProp>,
    default: () => []
  },
  link: {
    type: String,
    required: false
  }
})

const _labels = computed(() => labels.map((l) => (l instanceof Array ? l : ([l, undefined] as const))))
</script>

<template>
  <NoteBox>
    <div class="header">
      <div class="name">
        <a v-if="link" :href="link" target="_blank">
          <code>{{ name }}</code>
        </a>
        <code v-else>{{ name }}</code>
      </div>
      <div class="labels">
        <Label v-for="[label, color] in _labels" :color="color">{{ label }}</Label>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </NoteBox>
</template>

<style scoped>
.header {
  @apply flex flex-row flex-nowrap;
  .name {
    @apply flex-[1];
  }
  .labels {
  }
}
.content {
  :first-child {
    margin-top: 0;
  }
  :last-child {
    margin-bottom: 0;
  }
}
</style>
