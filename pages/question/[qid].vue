<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import type { ISubmissionOption } from "~~/types/form";
import ThemeCataniaQuestionDetail from "~~/components/theme/catania/question/Detail.vue";

definePageMeta({
  layout: "form",
  title: "Question",
});
const route = useRoute();
const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = computed(() => submissionStore.submission);

const form = computed(() => formStore.form);
const question = computed(() =>
  formStore.getQuestionById(parseInt(route.params.qid as string))
);
watch(
  question,
  (value) => {
    if (!value) {
      throw new Error("Question not found");
    } else {
      submissionStore.setQuestion(value);
    }
  },
  { immediate: true }
);
const allQuestions = computed(() =>
  formStore.flows.reduce((acc, flow) => {
    return acc.concat(flow.questions);
  }, [] as IFormQuestion[])
);
const totalQuestions = computed(() =>
  formStore.flows.reduce((acc, flow) => acc + flow.questions.length, 0)
);
const progress = computed(
  () =>
    (90 * allQuestions.value.findIndex((q) => q.id === question.value.id) + 1) /
      totalQuestions.value +
    10
);
useAppStore().setCurrentProgress({
  label: question.value.title,
  value: progress.value,
});

const selectedOption = ref<ISubmissionOption>(null);
function selectOption(opt: ISubmissionOption) {
  // always override for date picker
  if (opt instanceof Date) {
    if (question.value.type === "date_picker") {
      selectedOption.value = opt;
    }
  }
  // otherwise toggle selected
  else {
    if (
      selectedOption.value &&
      !(selectedOption.value instanceof Date) &&
      (selectedOption.value as IFormQuestionOption)?.id === opt?.id
    ) {
      selectedOption.value = null;
    } else {
      selectedOption.value = opt;
    }
  }
  submissionStore.setQuestionOption(selectedOption.value);
  // if question has next button => wait for next button click
  if (question.value.hasNext) {
    return;
  }
  // otherwise goNext
  goNext();
}

const router = useRouter();
const currentFlow = computed(() =>
  formStore.flows.find((flow) => flow.id === question.value.flowId)
);
const currentQuestionIndex = computed(() =>
  currentFlow.value.questions.findIndex((q) => q.id === question.value.id)
);
function goBack() {
  let prevQuestion: IFormQuestion;
  // last question is in this flow
  if (currentQuestionIndex.value > 0) {
    prevQuestion = currentFlow.value.questions[currentQuestionIndex.value - 1];
  }
  // find previous flow
  else {
  }
  console.log(prevQuestion);
  if (prevQuestion) {
    router.push(`/question/${prevQuestion.id}`);
  }
}

function goNext() {
  const option = submissionStore.current.option;
  // user must selected an option or question allow no answer
  if (!option && !question.value.canSelectMulti) return;

  let nextQuestion: IFormQuestion;
  console.log(currentFlow.value);
  // next question still in this flow
  if (currentQuestionIndex.value < currentFlow.value.questions.length - 1) {
    nextQuestion = currentFlow.value.questions[currentQuestionIndex.value + 1];
  }
  console.log(nextQuestion);

  // if question is date picker, simply update data and move on
  if (option instanceof Date) {
    submissionStore.answerQuestion(question.value, option.toISOString());
  } else {
    const realOption = option as IFormQuestionOption;
    submissionStore.answerQuestion(
      question.value,
      realOption.value,
      realOption
    );
    // if selected option has next flow, go for it
    if (realOption.nextFlow) {
    } else {
      //
    }
  }
  // go to nextQuestion
  if (nextQuestion) {
    router.push(`/question/${nextQuestion.id}`);
  }
}
</script>

<template>
  <ThemeCataniaQuestionDetail
    @selected="selectOption"
    @next="goNext"
    @back="goBack"
  />
</template>
