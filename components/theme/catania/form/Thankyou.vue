<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = computed(() => submissionStore.submission);
const translation = computed(() => formStore.form.thankyouPage);
console.log(translation.value)
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
      <img v-if="banner.media" :src="banner.media.url" alt="Thank you" />
      <p v-if="banner.text">{{ banner.text }}</p>
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
  @apply flex justify-center gap-4 mt-6;
}
</style>
