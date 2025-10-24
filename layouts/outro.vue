<script setup lang="ts">
import Center from "@slidev/client/layouts/center.vue";
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  backgroundSize: {
    type: String,
    default: "cover",
  },
});

const title = computed(() => props.title ?? $slidev.configs.title);

const authors = computed<{ name: string; email?: string }[]>(() =>
  $slidev.configs.author
    ?.split(",")
    .map((i: string) => i.trim())
    .map((i: string) => i.match(/^([^<>]+[^ ]) ?(?:<(.*)>)?$/))
    .map((i: string[]) => ({ name: i[1], email: i[2] })),
);

const sourceCodeProvider = computed(() => {
  const sourceCode = $slidev.configs.sourceCode;
  if (!sourceCode) return null;
  if (/(https?:\/\/)?github/.test(sourceCode)) return "github";
  if (/(https?:\/\/)?gitlab/.test(sourceCode)) return "gitlab";
  return "generic";
});
</script>

<template>
  <Center
    class="flex flex-col justify-around text-center"
    :image="props.image"
    :backgroundSize="props.backgroundSize"
  >
    <div class="text-20">Thank you!</div>

    <h1 class="mt-10">{{ title }}</h1>

    <slot></slot>

    <div class="flex justify-center mt-10">
      <p class="p-5 flex flex-col" v-for="{ name, email } in authors">
        <span>{{ name }}</span>
        <small v-if="email">{{ email }}</small>
      </p>
    </div>

    <div class="m-2 text-xl">
      <a
        v-if="$slidev.configs.sourceCode"
        :href="$slidev.configs.sourceCode"
        target="_blank"
        class="slidev-icon-btn font-size-8"
      >
        <Icon
          icon="carbon:logo-github"
          v-if="sourceCodeProvider === 'github'"
        />
        <Icon
          icon="carbon:logo-gitlab"
          v-if="sourceCodeProvider === 'gitlab'"
        />
        <Icon icon="carbon:logo-git" v-if="sourceCodeProvider === 'generic'" />
      </a>
    </div>

    <PoweredBySlidev class="abs-br m-5" />
  </Center>
</template>
