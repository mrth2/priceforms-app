<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/solid";
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import YesNoVue from "./type/YesNo.vue";
import IconListVue from "./type/IconList.vue";
import DatePickerVue from "./type/DatePicker.vue";

const props = defineProps<{
  question: IFormQuestion;
}>();

const selectedOption = ref<IFormQuestionOption>(null);
const QuestionOptionComponent = computed(() => {
  switch (props.question.type) {
    case "yes_no":
    case "yes_no_icon":
      return YesNoVue;
    case "icon_list":
      return IconListVue;
    case "date_picker":
      return DatePickerVue;
  }
});
watch(selectedOption, () => console.log(selectedOption.value));
function selectOption(opt: IFormQuestionOption) {
  if (selectedOption.value && selectedOption.value.id === opt.id) {
    selectedOption.value = null;
  } else {
    selectedOption.value = opt;
  }
}
</script>

<template>
  <div class="question-detail">
    <div class="header-actions">
      <div>
        <NuxtLink to="/" class="back">
          <ChevronLeftIcon class="w-5 h-5 mt-1" />
          BACK
        </NuxtLink>
      </div>
      <!-- has next button + button on Top -->
      <CoreButton
        v-if="question.hasNext && question.nextButtonOnTop"
        class="btn-next"
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
      <div class="options">
        <Component
          :is="QuestionOptionComponent"
          :type="question.type"
          :selected="selectedOption"
          :options="question.options"
          @selected="selectOption"
        />
      </div>
    </div>
    <div class="footer-actions">
      <!-- has next button + button not on Top -->
      <CoreButton
        v-if="question.hasNext && !question.nextButtonOnTop"
        class="btn-next"
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
    @apply text-4xl font-extrabold text-catania-primary;
  }
}
</style>
