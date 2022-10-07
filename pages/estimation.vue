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
const router = useRouter();
const submissionStore = useSubmissionStore();
// if no subscriber, go back to home
const form = computed(() => useFormStore().form);
if (!submissionStore.submission?.subscriber) {
  // if form has register form before estimation, go back to register form
  if (form.value.registerFormPosition === "beforeEstimation") {
    router.push("/signup");
  }
  else {
    router.push("/");
  }
}
// auto set progress to 100%
onMounted(() => {
  submissionStore.setProgress(100);
  submissionStore.setStopAt('Estimation');
  submissionStore.saveSubmission();
});

function goBack() {
  if (form.value.registerFormPosition === 'beforeEstimation') {
    router.push('/signup');
    return;
  }
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
      router.push(`/question/${lastQuestion.id}`);
    }
  }
}
</script>

<template>
  <ThemeCataniaFormCaseEstimation @back="goBack" />
</template>
