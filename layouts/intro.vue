<script setup lang="ts">
import ImageRight from "@slidev/client/layouts/image-right.vue"
import { computed } from "vue"
import { Icon } from "@iconify/vue"
import { getSourceCode } from "../components/utilities/source_code"
import { getAuthors, getTitle } from "../components/utilities/metadata"

const props = defineProps({
  image: {
    type: String
  },
  backgroundSize: {
    type: String,
    default: "cover"
  }
})

const title = computed(() => getTitle($slidev))
const authors = computed(() => getAuthors($slidev))
const sourceCode = computed(() => getSourceCode($slidev))
</script>

<template>
  <ImageRight
    class="flex flex-col justify-around text-center"
    :image="props.image"
    :backgroundSize="props.backgroundSize"
  >
    <h1>{{ title }}</h1>

    <slot></slot>

    <div class="flex justify-center mt-10">
      <p class="p-5 flex flex-col" v-for="{ name, email } in authors">
        <span>{{ name }}</span>
        <small v-if="email">{{ email }}</small>
      </p>
    </div>

    <div @click="$nav.nextSlide" class="mt-12 py-1" hover:bg="white op-10">
      Press Space for next page
      <Icon icon="carbon:arrow-right" style="display: inline" />
    </div>

    <div class="abs-br m-2 text-xl">
      <a v-if="sourceCode" :href="sourceCode.url" target="_blank" class="slidev-icon-btn font-size-8">
        <Icon icon="carbon:logo-github" v-if="sourceCode.provider === 'github'" />
        <Icon icon="carbon:logo-gitlab" v-if="sourceCode.provider === 'gitlab'" />
        <Icon icon="carbon:logo-git" v-if="sourceCode.provider === 'generic'" />
      </a>
    </div>
  </ImageRight>
</template>
