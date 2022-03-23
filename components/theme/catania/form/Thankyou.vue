<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = submissionStore.submission;
const translation = computed(() => formStore.form.thankyouPage);
const banner = computed(() => formStore.form.thankyouBanner);
</script>

<template>
  <div>
    <h1>
      {{
        translation.title.replace(/\[NAME\]/g, $fullname(submission.subscriber))
      }}
    </h1>
    <p class="message">{{ translation.message }}</p>
    <div class="banner">
      <ThemeCataniaFormBanner :banner="banner" class="!h-96 w-full" />
    </div>
    <div class="actions">
      <a :href="translation.returnLink || '/'" target="_blank">
        <CoreButton class="bg-catania-primary">
          {{ translation.buttonReturn }}
        </CoreButton>
      </a>
      <a :href="translation.promoLink || '/'" target="_blank">
        <CoreButton>
          {{ translation.buttonPromo }}
        </CoreButton>
      </a>
    </div>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply !mb-0;
}
.message {
  @apply text-center mb-6;
}
.banner {
  @apply flex flex-col items-center justify-center;
  img {
    @apply w-full h-96 object-cover relative;
  }
}
.actions {
  @apply flex flex-col sm:flex-row justify-center gap-4 mt-6 mb-6 md:mb-0;

  :deep(button) {
    @apply w-full;
  }
}
</style>
