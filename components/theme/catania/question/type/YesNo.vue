<script setup lang="ts">
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/vue/outline";

const props = defineProps<{
  type: IFormQuestion["type"];
  selected: Array<
    IFormQuestionOption | { id: "yes" | "no"; value: "YES" | "NO" }
  >;
  options: IFormQuestionOption[];
}>();
defineEmits(["selected"]);

const options = computed(() => {
  if (props.options && Array.isArray(props.options) && props.options.length) {
    return props.options;
  }
  return [
    {
      id: null,
      value: "YES",
    },
    {
      id: null,
      value: "NO",
    },
  ];
});

function isSelected(opt: typeof options.value[0]) {
  return props.selected.find(
    (s) =>
      (typeof s.id === "number" && s.id === opt.id) || s.value === opt.value
  );
}
function getIcon(opt: typeof options.value[0]) {
  if (opt.value === "YES") {
    return ThumbUpIcon;
  }
  return ThumbDownIcon;
}
</script>

<template>
  <div class="options">
    <CoreButton
      v-for="option in options"
      :key="option.value"
      type="outline"
      :class="{
        selected: isSelected(option),
        hasIcon: type === 'yes_no_icon',
      }"
      @click="$emit('selected', option)"
    >
      <Component v-if="type === 'yes_no_icon'" :is="getIcon(option)" />
      <template v-else>{{ option.value }}</template>
    </CoreButton>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-row gap-6 justify-center;

  :deep(button) {
    &.hasIcon {
      @apply !h-20 !w-24;
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
