<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useSubmissionStore } from "~~/store/submission";

definePageMeta({
  layout: "form",
  title: "Thank you for your submission",
});
useAppStore().setCurrentProgress({
  label: "Finish",
  value: 100,
});
// if no subscriber, go back to home
const submissionStore = useSubmissionStore();
if (!submissionStore.submission?.subscriber) {
  useRouter().push("/");
}
onMounted(() => {
  // when thankyou page is shown, clear the submission
  useSubmissionStore().setSubmission({});
});
</script>

<template>
  <ThemeCataniaFormThankyou />
</template>
