<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const props = withDefaults(
  defineProps<{
    label: string;
    progress: number;
  }>(),
  {
    label: "You're here",
    progress: 5,
  }
);

const color = computed(() => useFormStore().form.color);
const indicatorClasses = computed(() => {
  return ["bg-catania-accent"];
});
const activeBarClasses = computed(() => indicatorClasses.value);

const progressBar = ref<HTMLElement>();
const indicatorSize = ref(12);
const indicatorTranslateX = ref<number>(null);
const indicatorStyle = computed(() => ({
  transform: indicatorTranslateX.value
    ? `translateX(${indicatorTranslateX.value}px)`
    : null,
}));
const labelWidth = ref<number>(0);
const labelTranslateX = computed(() => {
  let result = null;
  if (indicatorTranslateX.value) {
    result = indicatorTranslateX.value + indicatorSize.value;
    result = Math.max(result, labelWidth.value / 2);
    result = Math.min(
      result,
      progressBar.value.getBoundingClientRect().width - labelWidth.value / 2
    );
  }
  return result;
});
const labelStyle = computed(() => ({
  left: labelTranslateX.value ? `${labelTranslateX.value}px` : null,
}));

const activeBarStyle = computed(() => {
  if (!indicatorTranslateX.value) return {};
  return {
    width: `${props.progress}%`,
  };
});
function updateIndicatorTranslate() {
  // update indicator size
  if (window.innerWidth < 768) {
    indicatorSize.value = 8;
  } else {
    indicatorSize.value = 12;
  }
  // update indicator translate x
  indicatorTranslateX.value =
    Math.ceil((progressBar.value.offsetWidth * props.progress) / 100) -
    indicatorSize.value;
  // update labelWidth
  const rect = progressBar.value
    .querySelector(".label")
    .getBoundingClientRect();
  labelWidth.value = rect.width;
}
onMounted(() => {
  updateIndicatorTranslate();
  // also on progress changes
  watch(() => props.progress, updateIndicatorTranslate);
  window.addEventListener("resize", updateIndicatorTranslate);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateIndicatorTranslate);
});
</script>

<template>
  <div ref="progressBar" class="progress-bar">
    <div class="progress">
      <div class="active" :class="activeBarClasses" :style="activeBarStyle" />
      <div
        class="indicator"
        :class="indicatorClasses"
        :style="indicatorStyle"
      />
      <div class="slide" />
    </div>
    <span class="label" :style="labelStyle">
      {{ label }}
    </span>
  </div>
</template>

<style scoped lang="postcss">
.progress-bar {
  @apply pt-6 md:pt-8 lg:pt-12 pb-6 lg:pb-8 relative;

  .progress {
    @apply relative w-full h-2 md:h-3 drop-shadow mb-3;
    .slide {
      @apply bg-gray-200 h-full rounded-lg;
    }
    .active {
      @apply rounded-lg h-2 md:h-3 absolute top-0 left-0 w-0;
      transition: width 400ms ease-out;
    }
    .indicator {
      @apply absolute rounded-full left-0 transition-transform duration-500 ease-out;
      @apply h-4 w-4 -top-1;
      @screen md {
        @apply h-6 w-6 -top-1.5;
      }
    }
  }
  .label {
    @apply w-max text-xs font-semibold text-catania-secondary tracking-wide leading-tight uppercase absolute transform -translate-x-1/2;
  }
}
</style>
