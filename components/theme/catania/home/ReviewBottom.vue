<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
</script>

<template>
  <div>
    <h1>{{ form.title }}</h1>
    <div class="intro">
      <ThemeCataniaFormBanner :banner="form.introBanner" />
      <ThemeCataniaHomeFormZip />
    </div>
    <ThemeCataniaHomeClientReviews v-if="!$isEmbedMode" />
  </div>
</template>

<style scoped lang="postcss">
.intro {
  @apply flex flex-col items-center sm:gap-4 md:gap-0 pb-4 md:pb-0;

  @screen md {
    @apply grid grid-cols-2;
  }

  :deep(.form-zip) {
    @apply md:pl-4;
  }
}
</style>
