export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      isEmbedMode: window.location.href.includes('embed') 
    }
  }
});