<script setup lang="ts">
import { useFormStore } from "~~/store/form";

definePageMeta({
  layout: "form",
  title: "Case Type",
});

const formStore = useFormStore();

const form = computed(() => formStore.form);
const categoryForm = computed(() => form.value.categoryForm);
formStore.setProgress({
  label: categoryForm.value.progress,
  value: 10,
});

const categories = computed(() => form.value.categories);
console.log(categories.value);
</script>

<template>
  <div></div>
</template>
