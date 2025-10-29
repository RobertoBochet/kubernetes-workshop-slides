<script setup lang="ts">
import Center from "@slidev/client/layouts/center.vue"
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
  <Center class="flex flex-col justify-around text-center" :image="props.image" :backgroundSize="props.backgroundSize">
    <div class="text-20">Thank you!</div>

    <h1 class="mt-10">{{ title }}</h1>

    <slot></slot>

    <div class="flex justify-center mt-10">
      <p class="p-5 flex flex-col" v-for="{ name, email } in authors">
        <span>{{ name }}</span>
        <small v-if="email">{{ email }}</small>
      </p>
    </div>

    <div class="abs-bl m-5 text-xl flex flex-row flex-nowrap items-center">
      <LicenseBadge hide-text />
      <a v-if="sourceCode" :href="sourceCode.url" target="_blank" class="slidev-icon-btn font-size-8 block">
        <Icon icon="carbon:logo-github" v-if="sourceCode.provider === 'github'" />
        <Icon icon="carbon:logo-gitlab" v-if="sourceCode.provider === 'gitlab'" />
        <Icon icon="carbon:logo-git" v-if="sourceCode.provider === 'generic'" />
      </a>
    </div>

    <PoweredBySlidev class="abs-br m-5" />
  </Center>
</template>
