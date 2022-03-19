<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

definePageMeta({
  layout: "form",
  title: "Question",
});
const route = useRoute();
const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = computed(() => submissionStore.submission);

const form = computed(() => formStore.form);
const question = computed(() =>
  formStore.getQuestionById(parseInt(route.params.qid as string))
);
watch(
  question,
  (value) => {
    if (!value) {
      console.log(formStore.flows)
      throw new Error("Question not found");
    }
  },
  { immediate: true }
);
const totalQuestions = computed(() =>
  formStore.flows.reduce((acc, flow) => acc + flow.questions.length, 0)
);
console.log(question.value);
const progress = computed(
  () => (90 * (submission.value.data.length + 1)) / totalQuestions.value + 10
);
useAppStore().setCurrentProgress({
  label: question.value.title,
  value: progress.value,
});
</script>

<template>
  <ThemeCataniaQuestionDetail :question="question" />
</template>
