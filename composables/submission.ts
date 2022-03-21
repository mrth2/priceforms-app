import { IFormSubmission } from "~~/types/form";

const LS_KEY = 'submission';
export const getSubmission = (): IFormSubmission => {
  try {
    if (typeof window.localStorage !== 'undefined') {
      const submission = localStorage.getItem(LS_KEY);
      return JSON.parse(submission);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const storeSubmission = (submission: IFormSubmission) => {
  try {
    if (typeof window.localStorage !== 'undefined' && submission) {
      localStorage.setItem(LS_KEY, JSON.stringify(submission));
    }
  } catch (e) {
    console.log(e);
  }
};

export const clearSubmission = () => {
  try {
    if (typeof window.localStorage !== 'undefined') {
      localStorage.removeItem(LS_KEY);
    }
  } catch (e) {
    console.log(e);
  }
};