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
  @apply rounded-lg shadow-main bg-white px-10 flex flex-col items-stretch;
  min-height: calc(100vh - 300px);
}
</style>
