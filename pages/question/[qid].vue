<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore, DEFAULT_ESTIMATION } from "~~/store/submission";
import {
  IFormCategoryFlow,
  IFormQuestion,
  IFormQuestionOption,
} from "~~/types/form";
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
const currentOptions = computed(() => submissionStore.current.options);

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
  let options: ISubmissionOption[] = [];
  submission.value.data
    .filter((d) => d.qid === question.value.id)
    .forEach((answered) => {
      // answer has optionId
      if (answered.oid && Number.isInteger(answered.oid)) {
        const option = question.value.options.find(
          (o) => o.id === answered.oid
        );
        if (option) {
          options.push(option);
        }
      }
      // answer is an ISODate string
      else if (
        answered.answer &&
        question.value.type === "date_picker" &&
        useNuxtApp().$isIsoDate(answered.answer)
      ) {
        options.push(new Date(answered.answer));
      }
      // answer is non option ( for yes / no question)
      else if (["yes_no", "yes_no_icon"].includes(question.value.type)) {
        options.push({
          id: answered.answer.toLowerCase(),
          value: answered.answer,
        } as unknown as IFormQuestionOption);
      }
    });
  submissionStore.setCurrentQuestionOptions(options);
  updateCurrentEstimation();
}
initCurrentQuestionAndOption();
watch(
  () => route.params.qid,
  async () => {
    // await nextTick();
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
const progress = computed(() =>
  submissionStore.getCurrentProgress(question.value.id)
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

function selectOption(opt: ISubmissionOption) {
  // always override for date picker
  if (opt instanceof Date) {
    if (question.value.type === "date_picker") {
      submissionStore.setCurrentQuestionOptions([opt]);
    }
  }
  // otherwise toggle selected
  else {
    // already selected => de-select
    if (currentOptions.value.find((o) => o["id"] === opt.id)) {
      submissionStore.setCurrentQuestionOptions(
        currentOptions.value.filter((o) => o["id"] !== opt.id)
      );
    }
    // not selected => select
    // can select multi
    else if (question.value.canSelectMulti) {
      submissionStore.setCurrentQuestionOptions([...currentOptions.value, opt]);
    }
    // can only select one
    else {
      submissionStore.setCurrentQuestionOptions([opt]);
    }
  }
  // calculate total current estimate price
  updateCurrentEstimation();
  // if question has next button => wait for next button click
  if (question.value.hasNext) {
    return;
  }
  // otherwise goNext
  goNext();
}

function updateCurrentEstimation() {
  const current = submissionStore.current.estimation;
  if (current.qid && current.qid !== question.value.id) {
    submissionStore.setCurrentEstimation(DEFAULT_ESTIMATION);
    return;
  }
  // calculate total current estimate price
  let totalMinPrice = 0,
    totalMaxPrice = 0;
  currentOptions.value.forEach((o) => {
    if (o?.["minPrice"]) {
      totalMinPrice += o["minPrice"];
    }
    if (o?.["maxPrice"]) {
      totalMaxPrice += o["maxPrice"];
    }
  });
  submissionStore.setCurrentEstimation({
    qid: question.value.id,
    minPrice: totalMinPrice,
    maxPrice: totalMaxPrice,
    currency: submission.value.currency,
  });
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
  if (prevQuestion) {
    router.push(`/question/${prevQuestion.id}`);
  } else {
    router.push("/cases");
  }
}

function goNext() {
  const options = submissionStore.current.options;
  // user must selected an option or question allow no answer
  if (!options.length && !question.value.canSelectNone) {
    // remove the answer of this question from data if found
    submissionStore.removeAnsweredQuestion(question.value.id);
    return;
  }
  let otherwiseFlow: IFormCategoryFlow;
  // parse otherwise Flow if any
  if (question.value.otherwiseFlow?.id) {
    otherwiseFlow = formStore.flows.find(
      (flow) => flow.id === question.value.otherwiseFlow.id
    );
  }

  let nextQuestion: IFormQuestion;
  // next question still in this flow
  if (currentQuestionIndex.value < currentFlow.value.questions.length - 1) {
    nextQuestion = currentFlow.value.questions[currentQuestionIndex.value + 1];
  }
  // user did not select any answer but this question allow empty
  if (!options.length && question.value.canSelectNone) {
    // if question has otherwise flow => go to otherwise flow
    if (otherwiseFlow) {
      nextQuestion = otherwiseFlow?.questions?.[0];
    }
  }
  // if question is date picker, simply update data and move on
  else if (options[0] instanceof Date) {
    submissionStore.answerQuestion({
      question: question.value,
      order: currentQuestionOrder.value,
      answers: [
        {
          answer: options[0].toISOString(),
          discount: 0,
        },
      ],
    });
  }
  // user pick one or more answer
  else {
    const answers = [];
    for (const option of options) {
      const realOption = option as IFormQuestionOption;
      answers.push({
        answer: realOption.value,
        option: realOption,
        // apply discount if any
        discount: realOption.discountPercent || 0,
      });
      // if selected option has next flow, go for it
      if (realOption.nextFlow) {
        const nextFlow = formStore.flows.find(
          (flow) => flow.id === realOption.nextFlow.id
        );
        nextQuestion = nextFlow?.questions[0];
      }
    }
    submissionStore.answerQuestion({
      question: question.value,
      order: currentQuestionOrder.value,
      answers,
    });
  }

  // if there are no nextQuestion in the current flow but there's otherwiseFlow configured
  if (!nextQuestion && otherwiseFlow) {
    nextQuestion = otherwiseFlow?.questions?.[0];
  }

  // go to nextQuestion
  if (nextQuestion) {
    router.push(`/question/${nextQuestion.id}`);
  }
  // if still there's no next question in the flow => end form
  else {
    router.push("/estimation");
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
