import VueGtag, { useGtag } from 'vue-gtag-next';
import { useFormStore } from '~~/store/form';
import { useSubmissionStore } from '~~/store/submission';

export default defineNuxtPlugin(nuxtApp => {
  const formStore = useFormStore();
  const router = useRouter();

  let gtagSetup = false;
  formStore.$subscribe(() => {
    if (!gtagSetup) {
      if (formStore.form?.gtagId) {
        nuxtApp.vueApp.use(VueGtag, {
          property: {
            id: formStore.form.gtagId,
          },
          appName: 'PriceForms',
          enabled: true,
          pageTrackerScreenviewEnabled: true,
        }, router);
        // setup gtag only once
        gtagSetup = true;
      }
    }
  });

  const submissionStore = useSubmissionStore();
  let subscriberInitialized = false;
  submissionStore.$subscribe(() => {
    if (!subscriberInitialized) {
      const { config } = useGtag();
      if (submissionStore.submission?.subscriber?.id) {
        config({
          user_id: submissionStore.submission.subscriber.id
        });
      }
      subscriberInitialized = true;
    }
  });
});