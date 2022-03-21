<script setup lang="ts">
import { useSubmissionStore } from "~~/store/submission";
import { IFormQuestionOption } from "~~/types/form";

defineProps<{
  selected: IFormQuestionOption[];
  options: IFormQuestionOption[];
}>();
defineEmits(["selected"]);

const question = computed(() => useSubmissionStore().current.question);
</script>

<template>
  <div class="options" :class="{ hasEstimate: question.showEstimate }">
    <CoreButton
      v-for="option in options"
      :key="option.id"
      type="outline"
      class="option-item"
      :class="{
        selected: selected.find(s => s.id === option.id),
      }"
      @click="$emit('selected', option)"
    >
      {{ option.value }}
    </CoreButton>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-col gap-5;

  &.hasEstimate {
    @apply grid grid-cols-2 grid-flow-row-dense;

    .option-item {
      @apply !text-catania-secondary !font-semibold;
    }
  }

  .option-item {
    @apply !px-20 !py-6;
    text-transform: unset !important;
  }
}
</style>
