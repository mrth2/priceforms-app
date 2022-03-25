import { useFormStore } from "~~/store/form";

export default defineNuxtRouteMiddleware(async (to) => {
  // always fetch forms & flows
  const formStore = useFormStore();
  if (to.name === '404') return;
  await Promise.all([
    formStore.loadForm(),
    formStore.loadFlows(),
  ]);
  // if form does not exist for the current subdomain, throw error
  if (!formStore.form?.id) {
    formStore.set404(true);
    console.log(123)
    return navigateTo('/404');
  }
  else {
    // init category tree
    formStore.initCategories();
  }
});