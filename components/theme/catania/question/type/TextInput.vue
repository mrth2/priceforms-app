<script setup lang="ts">
import { useSubmissionStore } from "~~/store/submission";
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import { ChevronRightIcon } from "@heroicons/vue/solid";
import { useAppStore } from "~~/store/app";

const props = defineProps<{
  type: IFormQuestion["type"];
  selected: { id: null; value: string }[];
  options: IFormQuestionOption[];
}>();

const submissionStore = useSubmissionStore();
const question = computed(() => submissionStore.current.question);

const emit = defineEmits(["selected"]);

const userInput = ref("");
watch(
  () => props.selected,
  () => {
    userInput.value = props.selected?.[0]?.value;
  }
);
if (props.selected.length) userInput.value = props.selected?.[0]?.value;

function onSubmit() {
  if (userInput.value === "") {
    useAppStore().pushNotification({
      type: "error",
      title: "Please fill in your answer",
      message: "We need your roof's current condition to proceed",
      position: 'center',
    });
    return;
  }
  emit("selected", { id: null, value: userInput.value });
}
</script>

<template>
  <div
    class="form-group"
    :class="{ 'form-group-area': question.type === 'text_area' }"
  >
    <input
      v-if="question.type === 'text_input'"
      v-model="userInput"
      class="form-input"
      type="text"
      placeholder="Enter your answer"
      autofocus
    />
    <textarea
      v-else-if="question.type === 'text_area'"
      v-model="userInput"
      class="form-area scroller"
      type="text"
      placeholder="Enter your answer"
      autofocus
    />
    <div class="w-full md:w-auto flex flex-row gap-3">
      <CoreButton class="h-10 text-xl w-full px-8 uppercase" @click="onSubmit">
        Next
      </CoreButton>
      <CoreButton
        v-if="question.canSelectNone"
        type="ghost"
        class="text-xl text-catania-secondary"
        @click="$emit('selected', { id: null, value: '' })"
      >
        <div class="flex flex-row items-center">
          <span>SKIP</span>
          <ChevronRightIcon class="w-6 h-6" />
        </div>
      </CoreButton>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.form-group {
  @apply w-full sm:w-2/3 flex flex-col md:flex-row gap-4 items-end;

  &.form-group-area {
    @apply flex-col items-center;
  }
}
.form-input {
  @apply text-center mt-10 h-10 text-xl font-semibold;
}
.form-area {
  @apply mt-10 px-3 py-2 text-base sm:text-lg md:text-xl border border-catania-secondary rounded min-h-[200px] w-full;
}
</style>
