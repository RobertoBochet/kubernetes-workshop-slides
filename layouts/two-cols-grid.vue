<template>
  <div class="slidev-layout two-cols-grid w-full h-full">
    <div class="col-header">
      <slot />
    </div>
    <div class="grid grid-cols-2 gap-x-1 gap-y-1 mt-10">
      <slot name="content" />
    </div>
  </div>
</template>

<style scoped>
.two-cols-grid :deep(p) {
  margin: 0;
}

.two-cols-grid :deep(h2),
.two-cols-grid :deep(h3) {
  margin-bottom: 0;
}
</style>
