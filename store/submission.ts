import { defineStore } from "pinia";
import { strapiParser } from "~~/services/helper";
import { IForm, IFormQuestion, IFormQuestionOption, IFormSubmission, IFormPricing } from "~~/types/form";
import type { ISubmissionOption } from "~~/types/form";
import { useAppStore } from "./app";
import { useFormStore } from "./form";
export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submission: {} as IFormSubmission,
    current: {
      question: null as IFormQuestion | null,
      option: null as ISubmissionOption | null,
      estimation: {
        minPrice: 0,
        maxPrice: 0,
        currency: 'usd'
      } as IFormPricing
    }
  }),
  getters: {
    getTotalEstimation: (state) => {
      return (excludeQuestionId: number | null) => {
        const allQuestions = useFormStore().getAllQuestions();
        let totalMinPrice = 0, totalMaxPrice = 0;
        state.submission.data
          .filter(d => !excludeQuestionId || d.qid !== excludeQuestionId)
          .forEach(d => {
            const question = allQuestions.find(q => q.id === d.qid);
            let minPrice = 0, maxPrice = 0;
            if (question) {
              const option = question?.options?.find(o => o.id === d.oid);
              if (option) {
                minPrice = option.minPrice;
                maxPrice = option.maxPrice;
              }
            }
            totalMinPrice += minPrice;
            totalMaxPrice += maxPrice;
          });
        return {
          minPrice: totalMinPrice,
          maxPrice: totalMaxPrice,
          currency: state.submission.currency
        }
      }
    }
  },
  actions: {
    setCurrentQuestion(question: IFormQuestion) {
      this.current.question = question;
    },
    setCurrentQuestionOption(option: ISubmissionOption) {
      this.current.option = option;
    },
    setCurrentEstimation(estimation: IFormPricing) {
      this.current.estimation = estimation;
    },
    increaseCurrentEstimation(minPrice: number, maxPrice: number) {
      this.current.estimation.minPrice += minPrice;
      this.current.estimation.maxPrice += maxPrice;
    },
    decreaseCurrentEstimation(minPrice: number, maxPrice: number) {
      this.current.estimation.minPrice -= minPrice;
      this.current.estimation.maxPrice -= maxPrice;
    },
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
    answerQuestion({ question, answer, option, order }: { question: IFormQuestion, answer: string, option?: IFormQuestionOption, order: number }) {
      // filter out current question from data
      const newData = (this.submission.data as IFormSubmission['data']).filter(d => d.qid !== question.id);
      // append new question answer
      newData.push({
        fid: question.flowId,
        qid: question.id,
        oid: option?.id ?? null,
        title: question.title,
        question: question.question,
        answer,
        at: new Date().toISOString(),
        order
      });
      this.submission.data = newData;
      // save data path. IMPORTANT: data path won't be changed the order to keep order of flow
      // auto set status to partial if it's not marked as complete
      if (this.submission.status !== 'complete') {
        this.submission.status = 'partial';
      }
      // save to server as soon as user answer a question
      this.saveSubmission();
    },
    async saveSubmission() {
      const strapi = useStrapi4();
      const { id, ...submission } = this.submission as IFormSubmission;
      const totalEstimation = this.getTotalEstimation() as IFormPricing;
      const payload = {
        ...totalEstimation,
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