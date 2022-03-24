<script setup lang="ts">
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
const progressBar = ref<HTMLElement>();
const indicatorSize = 12;
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
    result = indicatorTranslateX.value + indicatorSize;
    result = Math.max(result, labelWidth.value / 2);
    result = Math.min(result, progressBar.value.getBoundingClientRect().width - labelWidth.value / 2);
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
  indicatorTranslateX.value =
    Math.ceil((progressBar.value.offsetWidth * props.progress) / 100) -
    indicatorSize;
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
      <div class="active" :style="activeBarStyle" />
      <div class="indicator" :style="indicatorStyle" />
      <div class="slide" />
    </div>
    <span class="label" :style="labelStyle">
      {{ label }}
    </span>
  </div>
</template>

<style scoped lang="postcss">
.progress-bar {
  @apply pt-12 pb-8 relative;

  .progress {
    @apply relative w-full h-3 drop-shadow mb-3;
    .slide {
      @apply bg-gray-200 h-full rounded-lg;
    }
    .active {
      @apply rounded-lg bg-catania-button h-3 absolute top-0 left-0 w-0;
      transition: width 400ms ease-out;
    }
    .indicator {
      @apply bg-catania-button absolute h-6 w-6 rounded-full left-0 -top-1.5 transition-transform duration-500 ease-out;
    }
  }
  .label {
    @apply w-max text-xs font-semibold text-catania-secondary tracking-wide leading-tight uppercase absolute transform -translate-x-1/2;
  }
}
</style>
