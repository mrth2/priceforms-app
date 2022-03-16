<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
</script>

<template>
  <div>
    <h1>{{ form.title }}</h1>
    <div class="grid grid-rows-2 lg:grid-rows-none lg:grid-cols-2 gap-6">
      <div class="intro">
        <ThemeCataniaHomeIntroBanner />
        <ThemeCataniaHomeFormZip />
      </div>
      <ThemeCataniaHomeClientReviews />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.intro {
  @apply grid grid-flow-row pb-4 h-full px-5;
  max-height: 650px;
}
</style>
