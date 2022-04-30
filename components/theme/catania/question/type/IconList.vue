<script setup lang="ts">
import { IFormQuestion, IFormQuestionOption } from "~~/types/form";

defineProps<{
  type: IFormQuestion["type"];
  selected: IFormQuestionOption[];
  options: IFormQuestionOption[];
}>();
defineEmits(["selected"]);
</script>

<template>
  <!-- condensed options list with reduced margin & padding when more than 6 options -->
  <div
    class="options"
    :class="{
      narrowed: options.length >= 8,
      condensed: options.length >= 6,
      scaled: options.length <= 3,
      'image-list': type === 'image_list',
    }"
  >
    <div
      v-for="option in options"
      :key="option.id"
      class="option-item"
      :class="{
        selected: selected.find((s) => s.id === option.id),
      }"
      @click="$emit('selected', option)"
      @mouseenter="($event) => ($event.target as HTMLElement).classList.add('hovering')"
      @mouseleave="($event) => ($event.target as HTMLElement).classList.remove('hovering')"
    >
      <div v-if="option.icon || option.iconActive" class="option-item-image">
        <img v-if="option.icon" class="icon" :src="option.icon.url" />
        <img
          v-if="option.iconActive"
          class="icon-active"
          :src="option.iconActive.url"
        />
        <img
          v-else-if="option.icon"
          class="icon-active"
          :src="option.icon.url"
        />
      </div>
      <div class="option-item-title">
        <h2 v-html="option.value.replace(/\\n/g, '<br/>')" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-wrap justify-center gap-4 max-w-xl mx-auto;

  &.image-list {
    @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense max-w-full;

    .option-item {
      @apply !max-w-full !w-auto !h-auto !max-h-max !p-2;

      .option-item-image {
        @apply !w-full !max-w-none !h-full flex justify-center items-center pt-0;

        .icon,
        .icon-active {
          @apply min-w-[60px];
        }
      }

      .option-item-title {
        @apply mt-auto mb-0;
      }
    }
  }

  &.condensed {
    @apply !my-4 max-w-2xl;

    .option-item {
      @apply lg:h-32;
      .option-item-title {
        @apply text-xs;
      }
    }
  }

  &.condensed.narrowed {
    .option-item {
      @screen md {
        max-width: calc(25% - 16px);
      }
    }
  }

  &.scaled {
    @apply !w-full max-w-none px-5;
    .option-item {
      @apply md:h-48 md:max-h-48;

      .option-item-image {
        /* @apply mb-4; */
      }
    }
  }

  .option-item {
    @apply flex flex-col items-center justify-center gap-1 w-full lg:w-32 max-h-48 h-48 md:max-h-44 md:h-44 lg:h-40 bg-gray-200 cursor-pointer px-2 transition-colors overflow-hidden;
    max-width: calc(50% - 8px);
    @screen md {
      max-width: calc(100% / 3 - 8px);
      flex: 1 0 30%;
    }

    .option-item-image {
      @apply max-w-[96px] flex items-center pt-4 mb-auto;
      @apply h-full;
      .icon,
      .icon-active {
        @apply object-cover;
      }
      .icon-active {
        @apply hidden;
      }
    }
    .option-item-title {
      @apply text-gray-600 text-center text-sm leading-4 mb-4 flex items-end justify-center;
    }
    &.selected,
    &.hovering {
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
