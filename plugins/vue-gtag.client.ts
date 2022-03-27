import VueGtag, { useGtag, isReady as gtagReady } from 'vue-gtag-next';
import { useFormStore } from '~~/store/form';
import { useSubmissionStore } from '~~/store/submission';

export default defineNuxtPlugin(nuxtApp => {
  const formStore = useFormStore();
  const router = useRouter();

  let gtagSetup = false;
  formStore.$subscribe(() => {
    if (!gtagSetup) {
      if (formStore.form && formStore.form?.gtagId) {
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
      // do not apply user config if gTag is not ready
      if (submissionStore.submission?.subscriber?.id && gtagReady.value) {
        config({
          user_id: submissionStore.submission.subscriber.id
        });
      }
      subscriberInitialized = true;
    }
  });
});