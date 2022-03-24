<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

defineEmits(["back"]);

const submissionStore = useSubmissionStore();
const estimatedResult = computed(() => ({
  minPrice: submissionStore.submission.minPrice,
  maxPrice: submissionStore.submission.maxPrice,
  currency: submissionStore.submission.currency,
}));
const translation = computed(() => useFormStore().form.estimationPage);
const showPrice = computed(
  () => estimatedResult.value.minPrice > 0 || estimatedResult.value.maxPrice > 0
);
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
    <template v-if="showPrice">
      <div class="result">
        <div class="result-item">
          <span class="price">
            {{
              $formatPrice(estimatedResult.minPrice, estimatedResult.currency)
            }}
          </span>
          <span class="label">{{ translation.minimum }}</span>
        </div>
        <span class="separator"> - </span>
        <div class="result-item">
          <span class="price">
            {{
              $formatPrice(estimatedResult.maxPrice, estimatedResult.currency)
            }}
            <strong class="price-note">*</strong>
          </span>
          <span class="label">{{ translation.maximum }}</span>
        </div>
      </div>
      <div class="explaination">{{ translation.note }}</div>
    </template>
    <template v-else>
      <div class="text-center mb-8 text-base font-medium">
        <h3 class="text-xl font-extrabold leading-10">Unknown at this time.</h3>
        <p>We will reach out to you if we can help you with your case.</p>
      </div>
    </template>
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
  @apply flex-1 flex flex-col justify-center items-center px-4 relative w-full;
}
.result {
  @apply flex flex-col xs:flex-row items-center w-max gap-0 xs:gap-3 text-catania-primary text-2xl xs:text-4xl sm:text-5xl lg:text-[52px] !leading-normal font-extrabold;

  .result-item {
    @apply flex flex-col justify-center items-center;

    .label {
      @apply font-bold;
    }
    .price {
      .price-note {
        @apply -ml-1 sm:-ml-2 md:-ml-3 lg:-ml-4;
      }
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
