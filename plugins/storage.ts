import { getSubmission } from "~~/composables/submission";
import { useSubmissionStore } from "~~/store/submission";

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:created', () => {
    console.log('app:created');
    const submissionFromLS = getSubmission();
    const submissionStore = useSubmissionStore();
    if (submissionFromLS) {
      submissionStore.setSubmission(submissionFromLS);
    }

    // subscribe to changes and reflect on LS
    submissionStore.$subscribe(async (mutation, state) => {
      // save to LS
      storeSubmission(state.submission);
    });
    console.log('app:created:done');
  })
});