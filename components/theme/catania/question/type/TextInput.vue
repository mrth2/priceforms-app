<script setup lang="ts">
import { useSubmissionStore } from "~~/store/submission";
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";

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
  emit('selected', { id: null, value: userInput })
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
    <div class="w-full md:w-auto">
      <CoreButton
        class="h-10 text-xl w-full uppercase"
        @click="onSubmit"
      >
        Submit
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
  @apply mt-10 px-3 py-2 text-xl border border-catania-secondary rounded min-h-[200px] w-full;
}
</style>
