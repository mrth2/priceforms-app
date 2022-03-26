<script setup lang="ts">
import { useFormStore } from "~~/store/form";

definePageMeta({
  layout: "default",
  title: "Home",
});
const homeStyle = computed(() => useFormStore().getHomeStyle);
</script>
<template>
  <ThemeCataniaHomeReviewRight v-if="homeStyle === 'reviewRight'" />
  <ThemeCataniaHomeReviewBottom v-if="homeStyle === 'reviewBottom'" />
</template>

<style scoped lang="postcss">
:deep(.intro) {
  @apply max-w-form bg-white px-2 sm:px-4 mx-auto items-center rounded shadow-main;
}
</style>
