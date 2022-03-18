import { getSubmission } from "~~/composables/submission";
import { useSubmissionStore } from "~~/store/submission";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:created', () => {
    console.log('app:created');
    const submissionFromLS = getSubmission();
    if (submissionFromLS) {
      useSubmissionStore().setSubmission(submissionFromLS);
    }
  })
});