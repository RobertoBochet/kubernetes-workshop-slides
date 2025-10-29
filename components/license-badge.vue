<script setup lang="ts">
import { computed } from "vue"
import { getLicense, getSourceCode } from "./utilities/source_code"

const props = defineProps({
  class: {
    type: String
  },
  hideText: {
    type: Boolean,
    default: false
  },
  hideSourceCode: {
    type: Boolean,
    default: false
  }
})

const license = computed(() => getLicense($slidev))
const sourceCode = computed(() => getSourceCode($slidev))
</script>

<template>
  <div v-if="license" :class="props.class">
    <a rel="license noreferrer" :href="license.link" target="_blank">
      <img :src="license.badge" :alt="license.name" />
    </a>
    <div class="text-3" v-if="!props.hideText">
      This work is licensed under a<br />
      <a rel="license noreferrer" :href="license.link" target="_blank">{{ license.name }}</a>
      .<br />
      <div v-if="sourceCode && !props.hideSourceCode">
        Source code available <a :href="sourceCode.url" target="_blank" rel="noreferrer">here</a>
      </div>
    </div>
  </div>
</template>
