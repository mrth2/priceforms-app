import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

export default defineNuxtRouteMiddleware(async (to) => {
  const is404 = to.name === "404";
  const isOnAdmin = to.path.includes('/admin');
  if (is404 || isOnAdmin) return;
  // always fetch forms & flows
  const formStore = useFormStore();
  const requests = [
    formStore.loadForm(),
  ];
  const requireCategories = to.path.includes('/cases');
  const requireLoadingFlows = to.path.includes('/question') || to.path.includes('/cases');
  if (requireCategories) {
    requests.push(formStore.loadCategories());
  }
  if (requireLoadingFlows) {
    requests.push(formStore.loadFlows());
    await Promise.all(requests);
  }
  else {
    await Promise.all(requests);
    Promise.all([
      formStore.loadCategories(),
      formStore.loadFlows(),
    ]).then(() => {
      // init category tree
      formStore.initCategories();
    });
  }

  // if form does not exist for the current subdomain, throw error
  if (!formStore.form?.id) {
    formStore.set404(true);
    return navigateTo('/404');
  }
  else if (requireLoadingFlows) {
    // init category tree
    formStore.initCategories();
  }
});