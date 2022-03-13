import { defineStore } from "pinia";
export const useSubmissionStore = defineStore('submission', {
  state: () => ({

  }),
  actions: {
    async deleteSubmission(submissionId: number) {
      const strapi = useStrapi4();
      await strapi.delete("form-submissions", submissionId);
    }
  }
});