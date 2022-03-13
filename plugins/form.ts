import { IFormSubmission } from "~~/types/form";

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      getStatusClass: (status: IFormSubmission['status'], noBg = true) => {
        return {
          [`${noBg ? '' : 'bg-cyan-100'} text-cyan-800`]: status === "register",
          [`${noBg ? '' : 'bg-blue-100'} text-blue-800`]: status === "partial",
          [`${noBg ? '' : 'bg-green-100'} text-green-800`]: status === "complete",
        };
      },
      getCurrencySymbol: (currency: IFormSubmission['currency']) => {
        switch (currency) {
          case 'usd':
            return '$';
          case 'eur':
            return '€';
          case 'gbp':
            return '£';
        }
      }
    }
  }
});