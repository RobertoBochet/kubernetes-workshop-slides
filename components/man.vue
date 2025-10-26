<script setup lang="ts">
const props = defineProps({
  command: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="my-5 shiki shiki-themes vitesse-dark vitesse-light slidev-code">
    <code class="language-shell">$ man {{ props.command }}</code>
    <div class="pl-4 pt-1">
      <span>DESCRIPTION</span><br />
      <div class="pl-12">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
