<script setup>
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const submissionStore = useSubmissionStore();
const estimatedResult = computed(() => ({
  minPrice: submissionStore.submission.minPrice,
  maxPrice: submissionStore.submission.maxPrice,
  currency: submissionStore.submission.currency,
}));
const translation = computed(() => useFormStore().form.estimationPage);
</script>

<template>
  <div class="current-estimation">
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
          <strong v-if="translation.note" class="price-note">*</strong>
        </span>
        <span class="label">{{ translation.maximum }}</span>
      </div>
    </div>
    <div v-if="translation.note" class="explaination">
      {{ translation.note }}
    </div>
  </div>
</template>

<style scoped lang="postcss">
.current-estimation {
  @apply flex-1 flex flex-col justify-center items-center px-4 relative w-full;
}
.result {
  @apply flex flex-col xs:flex-row items-center xs:items-start w-max gap-1 xs:gap-3;
  @apply text-catania-primary text-3xl xs:text-4xl sm:text-5xl lg:text-[52px];
  @apply !leading-none font-extrabold;

  .result-item {
    @apply flex flex-row-reverse xs:flex-col gap-3 items-center;

    .label {
      @apply font-bold !leading-none;

      &:after {
        content: ":";
        @apply inline-block;
      }

      @screen xs {
        &:after {
          @apply hidden;
        }
      }
    }
    .price {
      @apply leading-none;
      /* .price-note {
        @apply -ml-1 sm:-ml-2 md:-ml-3 lg:-ml-4;
      } */
    }
  }
  .label {
    @apply text-sm xs:-mt-2;
  }
}
.explaination {
  @apply text-xs leading-5 text-catania-secondary text-center mb-12 mt-6;
}
</style>
