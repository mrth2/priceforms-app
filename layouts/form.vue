<script setup lang="ts">
import { useAppStore } from "~~/store/app";
const currentProgress = computed(() => useAppStore().currentProgress);
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-[800px] mx-auto">
      <ThemeCataniaFormProgressBar
        :progress="currentProgress.value"
        :label="currentProgress.label"
      />
      <div class="form-content">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="postcss">
.form-content {
  @apply rounded-lg shadow-main bg-white px-2 sm:px-4 md:px-6 lg:px-10 flex flex-col items-stretch pb-2 md:pb-4 lg:pb-6;
  min-height: calc(100vh - 300px);
}
:deep(.header-actions) {
  /* @apply absolute inset-0 bottom-auto; */
  @apply flex flex-row justify-between items-center;
  .back {
    @apply cursor-pointer text-catania-secondary font-semibold text-sm md:text-base leading-none flex flex-row gap-0.5 items-center;
  }
}
</style>
