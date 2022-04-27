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
const hasPolicies = computed(
  () => footer.value.policy || footer.value.sitemap || footer.value.disclaimer
);
</script>

<template>
  <div class="footer-container">
    <div class="footer">
      <div v-if="hasPolicies" class="policies">
        <a :href="footer.policy" target="_blank">Privacy Policy</a>
        <a :href="footer.sitemap" target="_blank">Sitemap</a>
        <a :href="footer.disclaimer" target="_blank">Disclaimer</a>
      </div>
      <div class="copyright" :class="{ 'mx-auto': !hasPolicies }">
        {{ copyright }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.footer-container {
  @apply top-auto bottom-0 mx-auto flex justify-center shadow-main bg-white;
  padding: 0 var(--site-padding);
  @apply py-3 sm:py-5;
  @screen md {
    @apply pt-6 pb-12;
  }
}
.footer {
  @apply max-w-form flex flex-col sm:flex-row items-center sm:justify-between w-full text-xs font-light text-center;

  .policies {
    @apply flex gap-2 md:gap-4 xl:gap-6 font-normal;
  }
}
</style>
