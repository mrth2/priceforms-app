<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
</script>

<template>
  <div>
    <h1>{{ form.title }}</h1>
    <div class="review-right">
      <div class="intro">
        <ThemeCataniaFormBanner :banner="form.introBanner" />
        <ThemeCataniaHomeFormZip />
      </div>
      <ThemeCataniaHomeClientReviews />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.review-right {
  @apply grid lg:grid-rows-none lg:grid-cols-2 lg:grid-flow-col-dense items-center gap-4 lg:gap-6;
}
.intro {
  @apply flex flex-col pb-4 h-min px-5;

  @screen lg {
    max-height: 650px;
  }
}
</style>
