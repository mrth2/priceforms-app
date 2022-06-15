<script setup lang="ts">
import Cases from "../cases.vue";
import Estimation from "../estimation.vue";
import SignUp from "../signup.vue";
import ThankYou from "../thank-you.vue";
import { useAppStore } from "~~/store/app";

const route = useRoute();

const path = computed(() =>
  Array.isArray(route.params.path)
    ? route.params.path.join("/")
    : route.params.path
);
const TheComponent = computed(() => {
  switch (path.value) {
    case "cases":
      return Cases;
    case "estimation":
      return Estimation;
    case "signup":
      return SignUp;
    case "thank-you":
      return ThankYou;
    default:
      break;
  }
});
definePageMeta({
  layout: "form",
});
const appStore = useAppStore();
function defineMeta() {
  let title = "";
  switch (path.value) {
    case "cases":
      title = "Cases Type";
      break;
    case "estimation":
      title = "Your Case Estimation";
      break;
    case "signup":
      title = "Sign Up";
      break;
    case "thank-you":
      title = "Thank you for your submission";
      break;
    default:
      break;
  }
  appStore.setPageTitle(title);
}
onMounted(defineMeta);
</script>

<template>
  <Component :is="TheComponent" />
</template>
