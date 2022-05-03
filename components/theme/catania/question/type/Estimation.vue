<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const props = withDefaults(
  defineProps<{
    showDividedPrice: boolean;
    includeDividedPrice: boolean;
    separatePrice: boolean;
  }>(),
  {
    showDividedPrice: false,
    includeDividedPrice: false,
    separatePrice: false,
  }
);

const submissionStore = useSubmissionStore();
const currentEstimation = computed(() => submissionStore.getTotalEstimation());
const dividedPrice = computed(() => ({
  minPrice:
    currentEstimation.value.minPrice / currentEstimation.value.dividePriceBy,
  maxPrice:
    currentEstimation.value.maxPrice / currentEstimation.value.dividePriceBy,
  currency: currentEstimation.value.currency,
}));
const estimatedResult = computed(() => {
  // if estimated results contain dividePriceBy, then we need to divide the price by that number
  let { minPrice, maxPrice } = currentEstimation.value;
  if (props.showDividedPrice && !props.includeDividedPrice) {
    return dividedPrice.value;
  } else {
    if (props.includeDividedPrice) {
      minPrice += dividedPrice.value.minPrice;
      maxPrice += dividedPrice.value.maxPrice;
    }
    return {
      minPrice,
      maxPrice,
      currency: currentEstimation.value.currency,
    };
  }
});
const translation = computed(() => useFormStore().form.estimationPage);
</script>

<template>
  <div class="current-estimation">
    <template v-if="separatePrice">
      <h5>Financing cost:</h5>
      <div class="result breakdown mb-6">
        <div class="result-item">
          <span class="price">
            {{ $formatPrice(dividedPrice.minPrice, dividedPrice.currency) }}
          </span>
        </div>
        <div class="separator">-</div>
        <div class="result-item">
          <span class="price">
            {{ $formatPrice(dividedPrice.maxPrice, dividedPrice.currency) }}
          </span>
        </div>
      </div>
      <h5>General Cost:</h5>
      <div class="result breakdown mb-6">
        <div class="result-item">
          <span class="price">
            {{
              $formatPrice(
                estimatedResult.minPrice - dividedPrice.minPrice,
                dividedPrice.currency
              )
            }}
          </span>
        </div>
        <div class="separator">-</div>
        <div class="result-item">
          <span class="price">
            {{
              $formatPrice(
                estimatedResult.maxPrice - dividedPrice.maxPrice,
                dividedPrice.currency
              )
            }}
          </span>
        </div>
      </div>
    </template>
    <h4 v-if="separatePrice">Total Cost:</h4>
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

  h4 {
    @apply text-xl font-medium mb-4;
  }
  h5 {
    @apply text-base font-medium mb-3 text-catania-secondary;
  }

  .result.breakdown {
    @apply text-xl xs:text-2xl text-catania-secondary;
  }
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
