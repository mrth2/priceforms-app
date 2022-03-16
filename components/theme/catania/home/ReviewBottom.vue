<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
</script>

<template>
  <div class="styleB">
    <h1>{{ form.title }}</h1>
    <div class="intro">
      <ThemeCataniaHomeIntroBanner />
      <ThemeCataniaHomeFormZip />
    </div>
    <ThemeCataniaHomeClientReviews />
  </div>
</template>

<style scoped lang="postcss">
.intro {
  @apply grid grid-cols-2;
}
</style>
