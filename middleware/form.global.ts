import { useFormStore } from "~~/store/form";

export default defineNuxtRouteMiddleware(async () => {
  // always fetch forms
  await useFormStore().loadForm();
});