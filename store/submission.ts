import { defineStore } from "pinia";
import { strapiParser } from "~~/services/helper";
import { IForm, IFormQuestion, IFormQuestionOption, IFormSubmission, IFormPricing, ISubmissionEstimation, ISubmissionAnswer } from "~~/types/form";
import type { ISubmissionOption } from "~~/types/form";
import { useAppStore } from "./app";
import { useFormStore } from "./form";

export const DEFAULT_ESTIMATION = {
  qid: null as number | null,
  minPrice: 0,
  maxPrice: 0,
  currency: 'usd'
} as ISubmissionEstimation;

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submission: {} as IFormSubmission,
    current: {
      question: null as IFormQuestion | null,
      options: [] as ISubmissionOption[],
      estimation: DEFAULT_ESTIMATION
    }
  }),
  getters: {
    getTotalEstimation: (state) => {
      // calculate total estimation, excluding current question
      return (excludeQuestionId: number | null = null) => {
        if (!state.submission || !state.submission.data || !state.submission.data.length) {
          return { minPrice: 0, maxPrice: 0, dividePriceBy: 1, currency: 'usd' as IFormPricing['currency'] };
        }
        // get all questions in the current category
        const allQuestions = useFormStore().getAllQuestions();
        let totalMinPrice = 0, totalMaxPrice = 0, highestDiscount = 0, highestBonus = 0;
        // filter out the excluded question
        const filteredQuestions = state.submission.data.filter(d => !excludeQuestionId || d.qid !== excludeQuestionId);
        // calculate total square feet if any
        const totalSquareFeets = filteredQuestions.reduce((acc, d) => {
          const question = allQuestions.find(q => q.id === d.qid);
          if (question) {
            const option = question?.options?.find(o => o.id === d.oid);
            if (option) {
              if (option.unit === 'SquareFeet') {
                return [acc[0] + option.minPrice, acc[1] + option.maxPrice];
              }
              // const squareFeet = option.squareFeet || 0;
              // return acc + squareFeet;
            }
          }
          return acc;
        }, [0, 0] as [number, number]);
        // add up all prices
        let dividePriceBy = 1;
        filteredQuestions.forEach(d => {
          const question = allQuestions.find(q => q.id === d.qid);
          let minPrice = 0, maxPrice = 0;
          if (question) {
            const option = question?.options?.find(o => o.id === d.oid);
            if (option) {
              if (option.unit === 'Dollar') {
                minPrice = option.minPrice;
                maxPrice = option.maxPrice;
              }
              else if (option.unit === 'DollarSquareFeet') {
                minPrice = option.minPrice * totalSquareFeets[0] / option.unitCapacity;
                maxPrice = option.maxPrice * totalSquareFeets[1] / option.unitCapacity;
              }
              // if select this option will divide the price by this value, store the maximum division
              if (Number.isInteger(option.dividePriceBy) && option.dividePriceBy > 0) {
                if (dividePriceBy < option.dividePriceBy) {
                  dividePriceBy = option.dividePriceBy;
                }
              }
            }
          }
          totalMinPrice += minPrice;
          totalMaxPrice += maxPrice;
          if (d.discount > highestDiscount) highestDiscount = d.discount;
          if (d.bonus > highestBonus) highestBonus = d.bonus;
        });
        // apply discount if any
        let remain = 1;
        if (highestBonus > 0) {
          remain = (100 + highestBonus) / 100;
        }
        else {
          remain = (100 - highestDiscount) / 100;
        }
        return {
          minPrice: Math.ceil(totalMinPrice * remain),
          maxPrice: Math.ceil(totalMaxPrice * remain),
          dividePriceBy,
          currency: state.submission.currency
        }
      }
    },
    getHighestDiscount: (state) => {
      let highestDiscount = 0;
      state.submission.data.forEach(d => {
        if (d.discount && d.discount > highestDiscount) highestDiscount = d.discount;
      });
      return highestDiscount;
    },
    getHighestBonus: (state) => {
      let highestBonus = 0;
      state.submission.data.forEach(d => {
        if (d.bonus && d.bonus > highestBonus) highestBonus = d.bonus;
      });
      return highestBonus;
    }
  },
  actions: {
    setCurrentQuestion(question: IFormQuestion) {
      this.current.question = question;
    },
    setCurrentQuestionOptions(options: ISubmissionOption[]) {
      this.current.options = options;
    },
    setCurrentEstimation(estimation: ISubmissionEstimation) {
      this.current.estimation = estimation;
    },
    setSubmission(submission: IFormSubmission | {}) {
      this.submission = submission;
    },
    setForm(form: IForm) {
      this.submission.form = form;
    },
    setSubscriber(subscriber: IFormSubmission['subscriber']) {
      this.submission.subscriber = subscriber;
    },
    setMainCategory(category: IFormSubmission['category']) {
      this.submission.category = category;
      // also set stopAt
      this.submission.stopAt = `Case selected: ${category.title}`;
    },
    setCategories(categories: IFormSubmission['category'][], append = false) {
      if (append) {
        this.submission.categories.push(...categories);
      }
      else {
        this.submission.categories = categories;
      }
    },
    setStatus(status: IFormSubmission['status']) {
      this.submission.status = status;
    },
    setProgress(progress: IFormSubmission['progress']) {
      this.submission.progress = progress;
    },
    setStopAt(stopAt: IFormSubmission['stopAt']) {
      this.submission.stopAt = stopAt;
    },
    getCurrentProgress(questionId: number) {
      const allQuestions = useFormStore().getAllQuestions();
      return (90 * allQuestions.findIndex((q) => q.id === questionId) + 1) / allQuestions.length + 10;
    },
    // send the answers in array to allow multi options
    answerQuestion(payload: {
      question: IFormQuestion,
      order: number,
      answers: ISubmissionAnswer[],
    }) {
      // filter out current question from data & following questions in the ordered list
      // because when user answer a question, we need to remove all answered following questions in the data because they may not be valid to the latest updates of user journey
      const { question, order, answers } = payload;
      const newData = (this.submission.data as IFormSubmission['data'])?.filter(d => d.qid !== question.id && d.order <= order);
      // append new answers
      for (const item of answers) {
        const { answer, option, discount, bonus } = item;
        newData.push({
          cid: question.catId,
          fid: question.flowId,
          qid: question.id,
          oid: option?.id ?? null,
          title: question.title,
          question: question.question,
          answer,
          at: new Date().toISOString(),
          order,
          discount,
          bonus
        });
      }
      this.submission.stopAt = `Question: ${question.question}`;
      this.submission.data = newData;
      // update progress by current question progress
      this.setProgress(this.getCurrentProgress(question.id));
      // save to server as soon as user answer a question
      this.saveSubmission();
    },
    removeAnsweredQuestion(questionId: number) {
      this.submission.data = (this.submission.data as IFormSubmission['data'])?.filter(d => d.qid !== questionId);
      this.saveSubmission();
    },
    async saveSubmission() {
      const strapi = useStrapi4();
      const { id, ...submission } = this.submission as IFormSubmission;
      const totalEstimation = this.getTotalEstimation() as IFormPricing;
      // auto populate submission status base on current progress
      let status: IFormSubmission['status'];
      const progress = submission.progress || 0;
      if (progress >= 100) {
        status = 'complete';
      }
      else if (progress <= 10) {
        status = 'register';
      }
      else {
        status = 'partial';
      }
      const payload = {
        ...totalEstimation,
        zip: submission?.zip,
        subscriber: submission?.subscriber?.id,
        form: submission?.form?.id,
        category: submission?.category?.id,
        categories: submission?.categories?.map(c => c.id),
        status,
        progress,
        stopAt: submission?.stopAt,
        data: JSON.stringify(submission?.data || []),
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