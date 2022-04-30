<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore, DEFAULT_ESTIMATION } from "~~/store/submission";
import {
  IFormCategoryFlow,
  IFormQuestion,
  IFormQuestionOption,
  ISubmissionAnswer,
} from "~~/types/form";
import type { ISubmissionOption } from "~~/types/form";
import ThemeCataniaQuestionDetail from "~~/components/theme/catania/question/Detail.vue";
import { useGtag, isReady } from "vue-gtag-next";

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
          id: null,
          value: answered.answer,
        } as unknown as IFormQuestionOption);
      }
      // answer is just a text
      else if (["text_input", "text_area"].includes(question.value.type)) {
        options.push({
          id: null,
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

const currentCategories = computed(() => formStore.getCurrentCategories);
// back to category page if no category selected
if (!currentCategories.value || !currentCategories.value.length) {
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

const currentFlow = computed(() =>
  currentCategories.value
    .reduce(
      (acc, cat) => acc.concat(cat.flows.map((item) => item.flow)),
      [] as IFormCategoryFlow[]
    )
    .find((flow) => flow.id === question.value.flowId)
);
const currentQuestionIndex = computed(() =>
  currentFlow.value.questions.findIndex((q) => q.id === question.value.id)
);
const currentQuestionOrder = computed(() => {
  const index = allQuestions.value.findIndex((q) => q.id === question.value.id);
  if (index > -1) {
    return index + 2;
  }
  return 1;
});

function selectOption(opt: ISubmissionOption & { input?: string }) {
  // always override for date picker
  if (opt instanceof Date) {
    if (question.value.type === "date_picker") {
      submissionStore.setCurrentQuestionOptions([opt]);
    }
  }
  // otherwise toggle selected
  else {
    // already selected => de-select
    // only apply if the question has next button
    if (
      question.value.hasNext &&
      currentOptions.value.find((o) => o["id"] === opt.id)
    ) {
      submissionStore.setCurrentQuestionOptions(
        currentOptions.value.filter((o) => o["id"] !== opt.id)
      );
    }
    // not selected => select
    // can select multi
    else if (question.value.canSelectMulti) {
      submissionStore.setCurrentQuestionOptions([...currentOptions.value, opt]);
    }
    // option has user input
    if (opt.isInput && opt.input !== "") {
      const { input, ...optWithoutInput } = opt;
      submissionStore.setCurrentQuestionOptions([
        {
          ...optWithoutInput,
          value: input,
        },
      ]);
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
    const answeredInCurrentCategory = submission.value.data
      // filter out only category of this question
      .filter(
        (d) => currentQuestionInData && d.cid === currentQuestionInData.cid
      )
      // sort DESC by order in data
      .sort((a, b) => b.order - a.order)
      // get the first one after current question
      // current question is answered OR
      // current question is not answered yet => go to last answered question ( usually the one before this )
      .find(
        (d) => !currentQuestionInData || d.order < currentQuestionInData.order
      );
    // found => assign the prevQuestion
    if (answeredInCurrentCategory) {
      prevQuestion = allQuestions.value.find(
        (q) => q.id === answeredInCurrentCategory.qid
      );
    }
    // else try to find in other answer without current flow
    else {
      const answeredInOtherCategory = submission.value.data
        // filter out the current flow of current question
        .filter(
          (d) =>
            !currentQuestionInData ||
            (d.cid !== currentQuestionInData.cid &&
              // but must has lower order than current question
              d.order < currentQuestionInData.order)
        )
        // sort DESC by order in data
        .sort((a, b) => b.order - a.order)?.[0]; // get the first question in the list
      if (answeredInOtherCategory) {
        prevQuestion = allQuestions.value.find(
          (q) => q.id === answeredInOtherCategory.qid
        );
      }
    }
  }
  if (prevQuestion) {
    router.push(`/question/${prevQuestion.id}`);
  } else {
    router.push("/cases");
  }
}

const { event: gtagEvent } = useGtag();
function goNext() {
  const options = submissionStore.current.options;
  // user must selected an option or question allow no answer
  // skip checking for estimation question type
  if (
    !options.length &&
    !question.value.canSelectNone &&
    question.value.type !== "estimation"
  ) {
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

  // determining nextQuestion & nextFlow, sometimes it won't be the current flow ( which means user can jump to any flow in any category )
  let nextQuestion: IFormQuestion;
  let nextFlow: IFormCategoryFlow;
  // next question still in this flow
  if (currentQuestionIndex.value < currentFlow.value.questions.length - 1) {
    nextQuestion = currentFlow.value.questions[currentQuestionIndex.value + 1];
    nextFlow = currentFlow.value;
  }
  // user did not select any answer but this question allow empty
  if (!options.length && question.value.canSelectNone) {
    // if question has otherwise flow => go to otherwise flow
    if (otherwiseFlow) {
      nextQuestion = otherwiseFlow?.questions?.[0];
      nextFlow = otherwiseFlow;
      saveNextFlowCategory(nextFlow);
      submissionStore.saveSubmission();
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
          bonus: 0,
        },
      ],
    });
  }
  // user pick one or more answer
  else {
    const answers: ISubmissionAnswer[] = [];
    for (const option of options) {
      const realOption = option as IFormQuestionOption;
      answers.push({
        answer: realOption.value,
        option: realOption,
        // apply discount if any
        discount: realOption.discountPercent || 0,
        bonus: realOption.bonusPercent || 0,
      });
      // if selected option has next flow, go for it
      if (realOption.nextFlow) {
        const realNextFlow = formStore.flows.find(
          (flow) => flow.id === realOption.nextFlow.id
        );
        nextQuestion = realNextFlow?.questions[0];
        nextFlow = realNextFlow;
      }
    }
    // save category first
    saveNextFlowCategory(nextFlow);
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

  // add event to GA
  isReady.value &&
    gtagEvent("answer_question", {
      question_id: question.value.id,
      question_title: question.value.title,
    });
  console.log(currentFlow.value);
  // if there's option with endOfFlow set to true, then end of flow
  const isEndOfFlow = options.find((o) => o?.["endOfFlow"]);
  if (isEndOfFlow) {
    if (!currentFlow.value.skipEstimation) {
      router.push("/estimation");
    } else {
      submissionStore.setProgress(100);
      submissionStore.saveSubmission();
      router.push("/thank-you");
    }
  }
  // go to nextQuestion
  else if (nextQuestion) {
    router.push(`/question/${nextQuestion.id}`);
  }
  // if still there's no next question in the flow => end form
  // only if next flow does not skip showing estimation
  else if (!currentFlow.value.skipEstimation) {
    router.push("/estimation");
  } else {
    submissionStore.setProgress(100);
    submissionStore.saveSubmission();
    router.push("/thank-you");
  }
}

function saveNextFlowCategory(nextFlow: IFormCategoryFlow) {
  if (nextFlow) {
    // append the nextFlow category to submission categories list
    const nextFlowCategory = formStore.categories.find(
      (c) => c.id === nextFlow.category.id
    );
    if (
      nextFlowCategory &&
      !submissionStore.submission.categories.find(
        (sc) => sc.id === nextFlowCategory.id
      )
    ) {
      submissionStore.setCategories([nextFlowCategory], true);
    }
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
