<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const route = useRoute();
const currentProgress = computed(() => useFormStore().currentProgress);
</script>

<template>
  <NuxtLayout name="default">
    <div class="max-w-[800px] mx-auto">
      <ThemeCataniaFormProgressBar
        :progress="currentProgress.value"
        :label="currentProgress.label"
      />
      <div class="content">
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped lang="postcss">
.content {
  @apply rounded-lg shadow-main bg-white min-h-[300px] px-10;
}
</style>
