import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

export default defineNuxtPlugin(nuxtApp => {
  config.autoAddCss = false;
  library.add(faFacebookF, faInstagram, faTwitter, faLinkedinIn, faYoutube);
  nuxtApp.vueApp.component('FaIcon', FontAwesomeIcon);
});