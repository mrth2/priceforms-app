import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedinIn,
  faYoutube,
  faYelp,
} from '@fortawesome/free-brands-svg-icons';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

export default defineNuxtPlugin(nuxtApp => {
  config.autoAddCss = false;
  library.add(faFacebookF, faInstagram, faTwitter, faLinkedinIn, faYoutube, faYelp, faMapLocationDot);
  nuxtApp.vueApp.component('FaIcon', FontAwesomeIcon);
});