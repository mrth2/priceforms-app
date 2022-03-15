<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const footer = computed(() => formStore.getFooter);
const copyright = computed(() =>
  footer.value
    ? footer.value.copyright.replace(
        /\[YEAR\]/g,
        new Date().getFullYear().toString()
      )
    : ""
);
</script>

<template>
  <div class="footer-container">
    <div class="footer">
      <div class="policies">
        <a :href="footer.policy" target="_blank">Privacy Policy</a>
        <a :href="footer.sitemap" target="_blank">Sitemap</a>
        <a :href="footer.disclaimer" target="_blank">Disclaimer</a>
      </div>
      <div class="copyright">
        {{ copyright }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.footer-container {
  @apply max-w-form absolute inset-0 top-auto mx-auto flex justify-center;
  @apply pt-6 pb-12 bg-white;
}
.footer {
  @apply flex flex-row justify-between w-full text-xs font-light;

  .policies {
    @apply flex gap-2 md:gap-4 xl:gap-6 font-normal;
  }
}
</style>
