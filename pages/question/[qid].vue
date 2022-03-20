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
const router = useRouter();
const route = useRoute();
const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = computed(() => submissionStore.submission);

const form = computed(() => formStore.form);
const question = computed(() =>
  formStore.getQuestionById(parseInt(route.params.qid as string))
);
function initCurrentQuestionAndOption() {
  // direct back to home if there's no data
  if (!submission.value || !submission.value.data || !question.value) {
    router.push("/");
    return;
  }
  // set current question
  submissionStore.setCurrentQuestion(question.value);
  // load selected option from localstorage if any
  const answered = submission.value.data.find(
    (d) => d.qid === question.value.id
  );
  if (answered) {
    // answer has optionId
    if (answered.oid && Number.isInteger(answered.oid)) {
      const option = question.value.options.find((o) => o.id === answered.oid);
      if (option) {
        submissionStore.setCurrentQuestionOption(option);
      }
    }
    // answer is an ISODate string
    else if (
      answered.answer &&
      question.value.type === "date_picker" &&
      useNuxtApp().$isIsoDate(answered.answer)
    ) {
      submissionStore.setCurrentQuestionOption(new Date(answered.answer));
    }
    // answer is non option ( for yes / no question)
    else if (["yes_no", "yes_no_icon"].includes(question.value.type)) {
      submissionStore.setCurrentQuestionOption({
        id: answered.answer.toLowerCase(),
        value: answered.answer,
      } as unknown as IFormQuestionOption);
    }
  }
}
initCurrentQuestionAndOption();
watch(
  () => route.params.qid,
  () => {
    if (!question.value) {
      // throw new Error("Question not found");
    } else {
      initCurrentQuestionAndOption();
    }
  }
);

const currentCategory = computed(() => formStore.getCurrentCategory);
// back to category page if no category selected
if (!currentCategory.value) {
  router.push("/cases");
}
// get all question in current category to calculate progress
const allQuestions = computed(() => formStore.getAllQuestions());
const progress = computed(
  () =>
    (90 * allQuestions.value.findIndex((q) => q.id === question.value.id) + 1) /
      allQuestions.value.length +
    10
);
useAppStore().setCurrentProgress({
  label: question.value.title,
  value: progress.value,
});

const currentFlow = computed(
  () =>
    currentCategory.value.flows.find(
      (item) => item.flow.id === question.value.flowId
    ).flow
);
const currentQuestionIndex = computed(() =>
  currentFlow.value.questions.findIndex((q) => q.id === question.value.id)
);
const currentQuestionOrder = computed(() => {
  const index = allQuestions.value.findIndex((q) => q.id === question.value.id);
  if (index > -1) {
    return index + 1;
  }
  return 1;
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
  submissionStore.setCurrentQuestionOption(selectedOption.value);
  submissionStore.setCurrentEstimation({
    minPrice: selectedOption.value?.["minPrice"] || 0,
    maxPrice: selectedOption.value?.["maxPrice"] || 0,
    currency: submission.value.currency,
  });
  // if question has next button => wait for next button click
  if (question.value.hasNext) {
    return;
  }
  // otherwise goNext
  goNext();
}
function goBack() {
  let prevQuestion: IFormQuestion;
  // last question is in this flow
  if (currentQuestionIndex.value > 0) {
    prevQuestion = currentFlow.value.questions[currentQuestionIndex.value - 1];
  }
  // find previous flow
  else {
    // find previous question from current data
    const currentQuestionInData = submission.value.data.find(
      (d) => d.qid === question.value.id
    );
    const answered = submission.value.data
      // sort DESC by order in data
      .sort((a, b) => b.order - a.order)
      // get the first one after current question
      // current question is answered OR
      // current question is not answered yet => go to last answered question ( usually the one before this )
      .find(
        (d) => !currentQuestionInData || d.order < currentQuestionInData.order
      );
    // found => assign the prevQuestion
    if (answered) {
      prevQuestion = allQuestions.value.find((q) => q.id === answered.qid);
    }
  }
  console.log(prevQuestion);
  if (prevQuestion) {
    router.push(`/question/${prevQuestion.id}`);
  } else {
    router.push("/cases");
  }
}

function goNext() {
  const option = submissionStore.current.option;
  // user must selected an option or question allow no answer
  if (!option && !question.value.canSelectMulti) {
    // remove the answer of this question from data if found
    submissionStore.removeAnsweredQuestion(question.value.id);
    return;
  }

  let nextQuestion: IFormQuestion;
  // next question still in this flow
  if (currentQuestionIndex.value < currentFlow.value.questions.length - 1) {
    nextQuestion = currentFlow.value.questions[currentQuestionIndex.value + 1];
  }
  // if question is date picker, simply update data and move on
  if (option instanceof Date) {
    submissionStore.answerQuestion({
      question: question.value,
      answer: option.toISOString(),
      order: currentQuestionOrder.value,
      discount: 0,
    });
  } else {
    const realOption = option as IFormQuestionOption;
    submissionStore.answerQuestion({
      question: question.value,
      answer: realOption.value,
      option: realOption,
      order: currentQuestionOrder.value,
      // apply discount if any
      discount: realOption.discountPercent || 0,
    });
    // if selected option has next flow, go for it
    if (realOption.nextFlow) {
      const nextFlow = formStore.flows.find(
        (flow) => flow.id === realOption.nextFlow.id
      );
      nextQuestion = nextFlow?.questions[0];
    } else {
      // if there's no next question in the flow => end form
      if (!nextQuestion) {
        console.log("end form");
        router.push('/estimation');
      }
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
