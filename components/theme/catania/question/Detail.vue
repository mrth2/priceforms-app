<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import YesNoVue from "./type/YesNo.vue";
import IconListVue from "./type/IconList.vue";
import DatePickerVue from "./type/DatePicker.vue";
import OptionListVue from "./type/OptionList.vue";
import { useSubmissionStore } from "~~/store/submission";

defineEmits(["selected", "next", "back"]);

const submissionStore = useSubmissionStore();
const question = computed(() => submissionStore.current.question);
const option = computed(() => submissionStore.current.option);
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
        v-if="question.hasNext && question.nextButtonOnTop"
        class="btn-next"
        @click="$emit('next')"
      >
        Next
      </CoreButton>
    </div>
    <div v-if="question.showEstimate" class="estimation">
      <span class="label">YOUR CASE ESTIMATE</span>
      <span class="price">$26,000 - $120,000</span>
    </div>
    <div class="question-content">
      <h1>{{ question.question }}</h1>
      <Component
        :is="QuestionOptionComponent"
        :type="question.type"
        :selected="option"
        :options="question.options"
        @selected="$emit('selected', $event)"
      />
    </div>
    <div class="footer-actions">
      <!-- has next button + button not on Top -->
      <CoreButton
        v-if="question.hasNext && !question.nextButtonOnTop"
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
.header-actions {
  @apply absolute inset-0 bottom-auto;
  @apply flex flex-row justify-between items-center;
  .back {
    @apply cursor-pointer text-catania-secondary font-semibold flex flex-row gap-0.5 items-center;
  }
}
.btn-next {
  @apply uppercase font-bold h-9 px-4 tracking-wide;
}
.footer-actions {
  @apply flex justify-center;
}
.estimation {
  @apply flex flex-row justify-center my-4;

  .label,
  .price {
    @apply px-5 h-10 border border-catania-secondary rounded text-center leading-9 font-bold;
  }
  .label {
    @apply bg-catania-primary text-white border-r-0 rounded-r-none;
  }
  .price {
    @apply text-catania-primary border-l-0 rounded-l-none;
  }
}
.question-content {
  @apply flex-1 flex flex-col justify-center items-center;

  :deep(h1) {
    @apply text-4xl font-extrabold text-catania-primary pt-4 !important;
  }

  :deep(.options) {
    button {
      @apply px-8 h-10 text-lg uppercase text-catania-primary font-extrabold transition-colors;

      &.selected,
      &:hover {
        @apply bg-catania-primary text-white border-catania-primary;
      }
    }
  }
}
</style>
