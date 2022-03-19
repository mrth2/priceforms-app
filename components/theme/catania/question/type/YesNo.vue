<script setup lang="ts">
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/vue/outline";

const props = defineProps<{
  type: IFormQuestion["type"];
  selected: Partial<IFormQuestionOption>;
  options: IFormQuestionOption[];
}>();
console.log(props.options, props.type);
defineEmits(["selected"]);
const selectedOption = ref<"yes" | "no">(null);

function selectOption(opt: "yes" | "no") {
  if (selectedOption.value === opt) {
    selectedOption.value = null;
  } else {
    selectedOption.value = opt;
  }
}
</script>

<template>
  <div class="options">
    <CoreButton
      type="outline"
      :class="{
        selected: selectedOption && selectedOption === 'yes',
        hasIcon: type === 'yes_no_icon',
      }"
      @click="selectOption('yes')"
    >
      <ThumbUpIcon v-if="type === 'yes_no_icon'" />
      <template v-else>YES</template>
    </CoreButton>
    <CoreButton
      type="outline"
      :class="{
        selected: selectedOption && selectedOption === 'no',
        hasIcon: type === 'yes_no_icon',
      }"
      @click="selectOption('no')"
    >
      <ThumbDownIcon v-if="type === 'yes_no_icon'" />
      <template v-else>NO</template>
    </CoreButton>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-row gap-6;

  :deep(button) {
    @apply px-8 h-12 text-2xl uppercase text-catania-primary font-extrabold transition-colors;

    &.selected,
    &:hover {
      @apply bg-catania-primary text-white;
    }

    &.hasIcon {
      @apply h-20 w-24;
    }

    svg {
      @apply w-12 h-12;

      path {
        @apply stroke-[1.2px];
      }
    }
  }
}
</style>
