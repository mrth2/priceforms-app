<script setup lang="ts">
import { IFormQuestionOption } from "~~/types/form";

defineProps<{
  selected: IFormQuestionOption;
  options: IFormQuestionOption[];
}>();
defineEmits(["selected"]);
</script>

<template>
  <div class="options">
    <CoreButton
      v-for="option in options"
      :key="option.id"
      type="outline"
      class="option-item"
      :class="{
        selected: option.id === selected?.id,
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
}
</style>
