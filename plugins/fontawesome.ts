import pkg from '@fortawesome/fontawesome-svg-core';
const { library, config } = pkg;
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