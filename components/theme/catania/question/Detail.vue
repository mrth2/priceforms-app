<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { IFormPricing } from "~~/types/form";
import YesNoVue from "./type/YesNo.vue";
import IconListVue from "./type/IconList.vue";
import DatePickerVue from "./type/DatePicker.vue";
import OptionListVue from "./type/OptionList.vue";
import { useSubmissionStore } from "~~/store/submission";

defineEmits(["selected", "next", "back"]);

const submissionStore = useSubmissionStore();
const question = computed(() => submissionStore.current.question);
// auto apply next button if question hasNext or can select multi option
const hasNext = computed(
  () => question.value.hasNext || question.value.canSelectMulti
);
const options = computed(() => submissionStore.current.options);
const submission = computed(() => submissionStore.submission);
const totalEstimation = computed<IFormPricing>(() =>
  submissionStore.getTotalEstimation(question.value.id)
);
// highest discount in percentage
const highestDiscount = computed(() => submissionStore.getHighestDiscount);
// remaining percent, use to multiply the price directly ( already calculated the remaining percent )
const remainingPercent = computed(() => (100 - highestDiscount.value) / 100);
const estimation = computed<IFormPricing>(() => {
  return {
    minPrice: Math.ceil(
      (totalEstimation.value.minPrice +
        // plus the current estimate price if it's the same question
        (submissionStore.current.estimation.qid === question.value.id
          ? submissionStore.current.estimation.minPrice
          : 0)) *
        remainingPercent.value
    ),
    maxPrice: Math.ceil(
      (totalEstimation.value.maxPrice +
        // plus the current estimate price if it's the same question
        (submissionStore.current.estimation.qid === question.value.id
          ? submissionStore.current.estimation.maxPrice
          : 0)) *
        remainingPercent.value
    ),
    currency: submission.value.currency,
  };
});
const QuestionOptionComponent = computed(() => {
  switch (question.value.type) {
    case "yes_no":
    case "yes_no_icon":
      return YesNoVue;
    case "icon_list":
      return IconListVue;
    case "option_list":
      return OptionListVue;
    case "date_picker":
      return DatePickerVue;
  }
});
</script>

<template>
  <div class="question-detail">
    <div class="header-actions">
      <div>
        <a class="back" @click="$emit('back')">
          <ChevronLeftIcon class="w-5 h-5 mt-1" />
          BACK
        </a>
      </div>
      <!-- has next button + button on Top -->
      <CoreButton
        v-if="hasNext && question.nextButtonOnTop"
        class="btn-next top"
        @click="$emit('next')"
      >
        Next
      </CoreButton>
    </div>
    <div v-if="question.showEstimate" class="estimation">
      <span class="label">YOUR CASE ESTIMATE</span>
      <span class="price">
        <template v-if="estimation.minPrice > 0 || estimation.maxPrice > 0">
          {{ $formatPrice(estimation.minPrice, estimation.currency) }} -
          {{ $formatPrice(estimation.maxPrice, estimation.currency) }}
        </template>
        <template v-else>
          {{ $getCurrencySymbol(estimation.currency) }}0,000
        </template>
        <!-- show discount hint when applied & user selected option -->
        <strong
          v-if="
            highestDiscount > 0 &&
            options.length &&
            (estimation.minPrice > 0 || estimation.maxPrice > 0)
          "
          v-tippy="{ content: `Discounted by ${highestDiscount}%` }"
          class="discount-note"
        >
          (*)
        </strong>
      </span>
    </div>
    <div class="question-content">
      <!-- wrap h1 if more than 8 words -->
      <h1 :class="{ wrap: question.question.split(' ').length > 8 }">
        {{ question.question }}
      </h1>
      <p v-if="question.description" class="text-catania-secondary">
        {{ question.description }}
      </p>
      <Component
        :is="QuestionOptionComponent"
        :type="question.type"
        :selected="options"
        :options="question.options"
        @selected="$emit('selected', $event)"
      />
    </div>
    <div class="footer-actions">
      <!-- has next button + button not on Top -->
      <CoreButton
        v-if="hasNext && !question.nextButtonOnTop"
        class="btn-next"
        @click="$emit('next')"
      >
        Next
      </CoreButton>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.question-detail {
  @apply mt-6 mb-10 flex-1 flex flex-col relative;
}
.btn-next {
  @apply uppercase font-bold text-lg h-12 px-6 tracking-wide;

  &.top {
    @apply h-10;
  }
}
.footer-actions {
  @apply flex justify-center;
}
.estimation {
  @apply flex flex-row justify-center mt-10;

  .label,
  .price {
    @apply px-5 h-12 border-2 rounded text-center font-bold leading-10;
  }
  .discount-note {
    @apply text-xs absolute mt-2 ml-1 cursor-pointer text-center;
  }
  .label {
    @apply bg-catania-primary border-catania-primary text-white border-r-0 rounded-r-none;
  }
  .price {
    @apply w-60 border-catania-outline text-catania-primary border-l-0 rounded-l-none;
  }
}
.question-content {
  @apply flex-1 flex flex-col justify-center items-center;

  :deep(h1) {
    @apply text-3xl font-extrabold text-catania-primary my-0 pt-6 !important;

    &.wrap {
      @apply px-16;
    }
  }

  :deep(.options) {
    @apply my-10;
    button {
      @apply px-8 h-10 text-lg uppercase text-catania-primary font-extrabold transition-colors;

      &.selected,
      &:hover {
        @apply bg-catania-primary !text-white border-catania-primary;
      }
    }
  }
}
</style>
