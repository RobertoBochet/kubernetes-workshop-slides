<template>
  <div class="slidev-layout w-full h-full">
    <div>
      <slot />
    </div>

    <div class="mt-7">
      <slot name="steps" />
    </div>

    <div class="mt-5 px-5">
      <slot name="content" />
    </div>
  </div>
</template>
