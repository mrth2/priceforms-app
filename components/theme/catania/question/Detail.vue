<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { IFormPricing } from "~~/types/form";
import YesNoVue from "./type/YesNo.vue";
import IconListVue from "./type/IconList.vue";
import DatePickerVue from "./type/DatePicker.vue";
import OptionListVue from "./type/OptionList.vue";
import TextInputVue from "./type/TextInput.vue";
import EstimationVue from "./type/Estimation.vue";
import { useSubmissionStore } from "~~/store/submission";

defineEmits(["selected", "next", "back"]);

const submissionStore = useSubmissionStore();
const question = computed(() => submissionStore.current.question);
// auto apply next button if question hasNext or can select multi option
const hasNext = computed(
  () =>
    // text input / area question type will not have next button
    !["text_input", "text_area"].includes(question.value.type) &&
    (question.value.hasNext ||
      question.value.canSelectMulti ||
      question.value.type === "estimation")
);
const options = computed(() => submissionStore.current.options);
const canGoNext = computed(
  () =>
    question.value.canSelectNone ||
    options.value.length ||
    question.value.type === "estimation"
);
const nextMsg = "Please select at least one option";
const topButtonTippy = computed(() => ({
  content: canGoNext.value ? null : nextMsg,
  interactive: true,
  placement: "left",
}));
const bottomButtonTippy = computed(() => ({
  content: canGoNext.value ? null : nextMsg,
  interactive: true,
  placement: "top",
}));
const submission = computed(() => submissionStore.submission);
const totalEstimation = computed<IFormPricing>(() =>
  submissionStore.getTotalEstimation(question.value.id)
);
// highest discount in percentage
const highestDiscount = computed(() => submissionStore.getHighestDiscount);
// highest bonus in percentage
const highestBonus = computed(() => submissionStore.getHighestBonus);
// remaining percent, use to multiply the price directly ( already calculated the remaining percent )
const remainingPercent = computed(() => {
  if (highestBonus.value > 0) {
    return (100 + highestBonus.value) / 100;
  }
  return (100 - highestDiscount.value) / 100;
});
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
const discountNoteTippy = computed(() => {
  if (highestBonus.value) {
    return {
      content: "Increased by " + highestBonus.value + "%",
    };
  }
  if (highestDiscount.value) {
    return {
      content: `Discounted by ${highestDiscount.value}%`,
    };
  }
  return null;
});
const QuestionOptionComponent = computed(() => {
  switch (question.value.type) {
    case "yes_no":
    case "yes_no_icon":
      return YesNoVue;
    case "icon_list":
    case "image_list":
      return IconListVue;
    case "option_list":
      return OptionListVue;
    case "date_picker":
      return DatePickerVue;
    case "text_input":
    case "text_area":
      return TextInputVue;
    case "estimation":
      return EstimationVue;
  }
});
</script>

<template>
  <div class="question-detail">
    <div class="header-actions">
      <div v-if="!question.backButtonOnBottom">
        <a class="back" @click="$emit('back')">
          <ChevronLeftIcon class="w-5 h-5" />
          <span class="leading-none">BACK</span>
        </a>
      </div>
      <!-- has next button + button on Top -->
      <CoreButton
        v-if="hasNext && question.nextButtonOnTop"
        v-tippy="topButtonTippy"
        class="action-button top"
        :class="{ disabled: !canGoNext }"
        @click="canGoNext && $emit('next')"
      >
        Next
      </CoreButton>
    </div>
    <div v-if="question.showEstimate" class="estimation">
      <span class="label">
        <span> YOUR CASE</span>
        <strong>ESTIMATE</strong>
      </span>
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
            (highestDiscount > 0 || highestBonus > 0) &&
            options.length &&
            (estimation.minPrice > 0 || estimation.maxPrice > 0)
          "
          v-tippy="discountNoteTippy"
          class="discount-note"
        >
          (*)
        </strong>
      </span>
    </div>
    <div
      class="question-content"
      :class="{ 'mt-6': question.type === 'estimation' }"
    >
      <!-- wrap h1 if more than 8 words -->
      <h1 :class="{ wrap: question.question.split(' ').length > 8 }">
        {{ question.question }}
      </h1>
      <p
        v-if="question.description"
        class="text-sm lg:text-base text-catania-secondary"
      >
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
      <!-- has back button on top -->
      <CoreButton
        v-if="question.backButtonOnBottom"
        type="delete"
        class="action-button"
        @click="$emit('back')"
      >
        Back
      </CoreButton>
      <!-- has next button + button not on Top -->
      <CoreButton
        v-if="hasNext && !question.nextButtonOnTop"
        v-tippy="bottomButtonTippy"
        class="action-button"
        :class="{ disabled: !canGoNext }"
        @click="canGoNext && $emit('next')"
      >
        Next
      </CoreButton>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.question-detail {
  @apply mt-2 md:mt-4 lg:mt-6 mb-2 md:mb-5 lg:mb-10 flex-1 flex flex-col relative;
}
.action-button {
  @apply uppercase font-bold text-sm lg:text-base lg:h-12 px-6 tracking-wide;

  &.top {
    @apply h-8 lg:h-10;
  }
  &.disabled {
    @apply cursor-not-allowed bg-catania-secondary;
  }
}
.footer-actions {
  @apply flex justify-center gap-4;
}
.estimation {
  @apply flex flex-row justify-center mt-4 lg:mt-10;

  .label,
  .price {
    @apply px-2 lg:px-5 h-auto lg:h-12 border-2 rounded text-center font-bold leading-8 lg:leading-10 text-sm lg:text-base;
  }
  .discount-note {
    @apply text-xs absolute mt-2 ml-1 cursor-pointer text-center;
  }
  .label {
    @apply bg-catania-primary border-catania-primary text-white border-r-0 rounded-r-none flex items-center justify-end gap-1 leading-9 text-justify;
    span {
      @apply hidden xs:inline-block;
    }
    strong {
      @apply inline-block;
    }
  }
  .price {
    @apply w-60 border-catania-outline text-catania-primary border-l-0 rounded-l-none pt-0.5;
  }
}
.question-content {
  @apply flex-1 flex flex-col justify-center items-center;

  :deep(h1) {
    @apply text-2xl lg:text-3xl font-extrabold text-catania-primary my-0 pt-4 !important;

    &.wrap {
      @apply px-6 md:px-12 lg:px-16;
    }
  }

  :deep(.options) {
    @apply my-10 w-full xs:w-auto;
    button {
      @apply px-8 h-10 text-base lg:text-lg uppercase text-catania-primary font-extrabold transition-colors;

      &.selected {
        @apply bg-catania-primary !text-white border-catania-primary;
      }
      @media (hover: hover) {
        &:hover {
          @apply bg-catania-primary !text-white border-catania-primary;
        }
      }
    }
  }
}
</style>
