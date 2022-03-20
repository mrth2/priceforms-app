<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

definePageMeta({
  layout: "form",
  title: "Your Case Estimation",
});
useAppStore().setCurrentProgress({
  label: "Finish",
  value: 100,
});
const submissionStore = useSubmissionStore();
function goBack() {
  // find the last answered question and direct to it
  const lastQuestionAnswered = submissionStore.submission.data.sort(
    (a, b) => b.order - a.order
  )?.[0];
  if (lastQuestionAnswered) {
    const allQuestions = useFormStore().getAllQuestions();
    const lastQuestion = allQuestions.find(
      (q) => q.id === lastQuestionAnswered.qid
    );
    if (lastQuestion) {
      useRouter().push(`/question/${lastQuestion.id}`);
    }
  }
};
</script>

<template>
  <ThemeCataniaFormCaseEstimation @back="goBack" />
</template>
