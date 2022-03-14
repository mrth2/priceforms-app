import { strapiParser } from "~~/services/helper";

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      strapiParser: strapiParser
    }
  }
});