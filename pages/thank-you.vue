<script setup lang="ts">
import { useAppStore } from "~~/store/app";

definePageMeta({
  layout: "form",
  title: "Thank you for your submission",
});
useAppStore().setCurrentProgress({
  label: "Finish",
  value: 100,
});
</script>

<template>
  <ThemeCataniaFormThankyou />
</template>
