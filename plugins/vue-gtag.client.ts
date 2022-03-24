import VueGtag from 'vue-gtag-next';
import { useFormStore } from '~~/store/form';

export default defineNuxtPlugin(nuxtApp => {
  const formStore = useFormStore();
  const router = useRouter();

  let gtagSetup = false;
  formStore.$subscribe(() => {
    if (!gtagSetup) {
      if (formStore.form.gtagId) {
        nuxtApp.vueApp.use(VueGtag, {
          property: {
            id: formStore.form.gtagId,
          },
          appName: 'PriceForms',
          enabled: true,
          pageTrackerScreenviewEnabled: true
        }, router);
        // setup gtag only once
        gtagSetup = true;
      }
    }
  });
});