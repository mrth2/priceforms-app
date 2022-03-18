import { IFormSubmission } from "~~/types/form";

const LS_KEY = 'submission';
export const getSubmission = (): IFormSubmission => {
  try {
    const submission = localStorage.getItem(LS_KEY);
    return JSON.parse(submission);
  } catch (e) {
    return null;
  }
};

export const storeSubmission = (submission: IFormSubmission) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(submission));
  } catch (e) {
    console.error(e);
  }
};

export const clearSubmission = () => {
  try {
    localStorage.removeItem(LS_KEY);
  } catch (e) {
    console.error(e);
  }
};