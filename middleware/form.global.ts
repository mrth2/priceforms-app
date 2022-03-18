import { useFormStore } from "~~/store/form";

export default defineNuxtRouteMiddleware(async () => {
  // always fetch forms & flows
  const formStore = useFormStore();
  await Promise.all([
    formStore.loadForm(),
    formStore.loadFlows(),
  ])
});