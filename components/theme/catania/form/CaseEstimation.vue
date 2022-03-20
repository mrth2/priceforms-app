<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const submissionStore = useSubmissionStore();
const estimatedResult = computed(() => ({
  minPrice: submissionStore.submission.minPrice,
  maxPrice: submissionStore.submission.maxPrice,
  currency: submissionStore.submission.currency,
}));
const translation = computed(() => useFormStore().form.estimationPage);
defineEmits(["back"]);
</script>

<template>
  <div class="estimation">
    <div class="header-actions mt-6">
      <div>
        <a class="back" @click="$emit('back')">
          <ChevronLeftIcon class="w-5 h-5 mt-1" />
          BACK
        </a>
      </div>
    </div>
    <h1>{{ translation.title }}</h1>
    <div class="result">
      <div class="result-item">
        <span class="price">
          {{ $formatPrice(estimatedResult.minPrice, estimatedResult.currency) }}
        </span>
        <span class="label">{{ translation.minimum }}</span>
      </div>
      <span class="separator"> - </span>
      <div class="result-item">
        <span class="price">
          {{ $formatPrice(estimatedResult.maxPrice, estimatedResult.currency) }}
          <strong class="-ml-4">*</strong>
        </span>
        <span class="label">{{ translation.maximum }}</span>
      </div>
    </div>
    <div class="explaination">{{ translation.note }}</div>
    <CoreButton
      class="text-lg uppercase font-bold px-6"
      @click="$router.push('/thank-you')"
    >
      Next
    </CoreButton>
  </div>
</template>

<style scoped lang="postcss">
.estimation {
  @apply flex-1 flex flex-col justify-center items-center px-4 relative;
}
.result {
  @apply flex flex-row w-max gap-3 text-catania-primary text-[52px] font-extrabold;

  .result-item {
    @apply flex flex-col justify-center items-center;

    .label {
      @apply font-bold;
    }
  }
  .label {
    @apply text-sm -mt-2;
  }
}
.explaination {
  @apply text-xs leading-5 text-catania-secondary text-center mb-12 mt-6;
}
</style>
