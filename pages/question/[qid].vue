<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

definePageMeta({
  layout: "form",
  title: "Question",
});
const formStore = useFormStore();
const submissionStore = useSubmissionStore();

const form = computed(() => formStore.form);
useAppStore().setCurrentProgress({
  label: "test",
  value: 15,
});
</script>

<template></template>
