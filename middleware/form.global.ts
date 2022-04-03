import { useFormStore } from "~~/store/form";

export default defineNuxtRouteMiddleware(async (to) => {
  const is404 = to.name === "404";
  if (is404) return;
  // always fetch forms & flows
  const formStore = useFormStore();
  const requests = [
    formStore.loadFormRest(),
  ];
  const isOnAdmin = to.path.includes('/admin');
  // on admin, load only the forms
  if (isOnAdmin) {
    await Promise.all(requests);
    return;
  }
  const requireCategories = to.path.includes('/cases');
  const requireLoadingFlows = to.path.includes('/question') || to.path.includes('/cases');
  if (requireCategories || requireLoadingFlows) {
    requests.push(formStore.loadCategoriesRest());
  }
  if (requireLoadingFlows) {
    requests.push(formStore.loadFlowsRest());
    await Promise.all(requests);
  }
  else {
    await Promise.all(requests);
    Promise.all([
      formStore.loadCategoriesRest(),
      formStore.loadFlowsRest(),
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