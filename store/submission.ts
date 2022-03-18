import { defineStore } from "pinia";
import { strapiParser } from "~~/services/helper";
import { IForm, IFormSubmission } from "~~/types/form";
import { useAppStore } from "./app";
export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submission: {} as IFormSubmission,
  }),
  actions: {
    setSubmission(submission: IFormSubmission) {
      this.submission = submission;
    },
    setForm(form: IForm) {
      this.submission.form = form;
    },
    setSubscriber(subscriber: IFormSubmission['subscriber']) {
      this.submission.subscriber = subscriber;
    },
    setCategory(category: IFormSubmission['category']) {
      this.submission.category = category;
    },
    setStatus(status: IFormSubmission['status']) {
      this.submission.status = status;
    },
    setProgress(progress: IFormSubmission['progress']) {
      this.submission.progress = progress;
    },
    async saveSubmission() {
      const strapi = useStrapi4();
      const { id, ...submission } = this.submission as IFormSubmission;
      const payload = {
        zip: submission?.zip,
        subscriber: submission?.subscriber?.id,
        form: submission?.form?.id,
        category: submission?.category?.id,
        status: submission?.status,
        progress: submission?.progress,
        stopAt: submission?.stopAt,
        data: JSON.stringify(submission?.data || []),
        dataPath: submission?.dataPath?.map(p => p.id),
      };
      // update
      try {
        let response;
        if (id) {
          response = await strapi.update('form-submissions', id, payload);
        }
        else {
          response = await strapi.create('form-submissions', payload);
        }
        this.setSubmission(response.data);
      } catch (e) {
        useAppStore().pushNotification({
          type: 'error',
          title: 'Error saving submission!',
          message: e.message
        });
      }
    },
    parseSubmission(submission) {
      const result = {
        ...submission,
        form: strapiParser(submission.form, ''),
      };
      return strapiParser(result);
    },
    async deleteSubmission(id: number) {
      const strapi = useStrapi4();
      await strapi.delete("form-submissions", id);
    }
  }
});