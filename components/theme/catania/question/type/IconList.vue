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
    <div
      v-for="option in options"
      :key="option.id"
      class="option-item"
      :class="{
        selected: option.id === selected?.id,
      }"
      @click="$emit('selected', option)"
    >
      <div class="option-item-image">
        <img class="icon" :src="option.icon.url" />
        <img class="icon-active" :src="option.iconActive.url" />
      </div>
      <div class="option-item-title">
        <h2>{{ option.value }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-wrap justify-center gap-4 pb-6 max-w-xl mx-auto;

  .option-item {
    @apply flex flex-col items-center justify-center gap-1 w-32 h-36 bg-gray-200 cursor-pointer p-4 transition-colors;
    flex: 1 0 30%;

    .option-item-image {
      .icon,
      .icon-active {
        @apply h-16 max-w-[64px] object-contain;
      }
      .icon-active {
        @apply hidden;
      }
    }
    .option-item-title {
      @apply text-center text-sm leading-4 h-6;
    }
    &.selected,
    &:hover {
      @apply bg-catania-primary;
      .icon-active {
        @apply block;
      }
      .icon {
        @apply hidden;
      }
      .option-item-title {
        @apply text-white;
      }
    }
  }
}
</style>
