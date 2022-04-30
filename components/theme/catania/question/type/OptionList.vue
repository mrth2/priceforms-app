<script setup lang="ts">
import { useSubmissionStore } from "~~/store/submission";
import { IFormQuestionOption } from "~~/types/form";

const props = defineProps<{
  selected: IFormQuestionOption[];
  options: IFormQuestionOption[];
}>();
const emit = defineEmits(["selected"]);

const question = computed(() => useSubmissionStore().current.question);

const hasInput = computed(() => !!props.options.find((o) => o.isInput));
const timeout = ref(null);
function onInput($event: Event, option: IFormQuestionOption) {
  if (timeout.value) window.clearTimeout(timeout.value);
  // timeout on input to prevent multiple emit
  timeout.value = window.setTimeout(() => {
    emit("selected", {
      ...option,
      input: ($event.target as HTMLInputElement).value,
    });
  }, 300);
}
</script>

<template>
  <div
    class="options"
    :class="{ hasEstimate: question.showEstimate, hasInput }"
  >
    <template v-for="option in options" :key="option.id">
      <CoreButton
        v-if="!option.isInput"
        type="outline"
        class="option-item"
        :class="{
          selected: selected.find((s) => s.id === option.id),
        }"
        @click="$emit('selected', option)"
      >
        {{ option.value }}
      </CoreButton>
      <div v-else class="option-item-input">
        <label>{{ option.value }}:</label>
        <input
          class="form-input"
          type="text"
          @keypress="($event) => onInput($event, option)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-col gap-5 flex-wrap justify-center items-center px-8 md:px-16 lg:px-0;
  &.hasInput {
    @apply flex-row max-w-lg;

    .option-item {
      max-width: calc(50% - 1.25rem / 2);
    }
  }

  &.hasEstimate {
    @apply flex-row;
    /* @apply grid grid-cols-2 grid-flow-row-dense; */

    .option-item {
      @apply !text-catania-secondary !font-semibold;

      @screen lg {
        width: calc(50% - 20px);
      }
    }
  }

  .option-item {
    @apply !px-20 !py-6 w-full;
    text-transform: unset !important;

    :deep(.btn-content) {
      @apply whitespace-nowrap;
    }

    @media screen and (max-width: theme("screens.xs")) {
      @apply !h-auto !py-2 !px-2;
      :deep(.btn-content) {
        @apply whitespace-normal;
      }
    }
  }
  .option-item-input {
    @apply flex-1 w-full flex flex-row items-center justify-center gap-3;
  }
}
</style>
