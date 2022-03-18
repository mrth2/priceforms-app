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
const labelTranslateX = computed(() =>
  indicatorTranslateX.value ? indicatorTranslateX.value + indicatorSize : null
);
const labelStyle = computed(() => ({
  left: labelTranslateX ? `${labelTranslateX}px` : null,
}));

function updateIndicatorTranslate() {
  indicatorTranslateX.value =
    Math.ceil((progressBar.value.offsetWidth * props.progress) / 100) -
    indicatorSize;
}
const route = useRoute();
onMounted(() => {
  updateIndicatorTranslate();
  // also on progress changes
  watch(() => props.progress, updateIndicatorTranslate);
});
</script>

<template>
  <div ref="progressBar" class="progress-bar">
    <div class="progress">
      <div class="active" :style="{ width: `${progress}%` }" />
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
    @apply relative w-full h-3 drop-shadow mb-2;
    .slide {
      @apply bg-gray-200 h-full rounded-lg;
    }
    .active {
      @apply rounded-lg bg-catania-button h-3 absolute top-0 transition-all duration-300;
    }
    .indicator {
      @apply bg-catania-button absolute h-6 w-6 rounded-full left-0 -top-1.5 transition-transform duration-300;
    }
  }
  .label {
    @apply text-xs font-semibold text-catania-secondary tracking-wide leading-tight uppercase absolute transform -translate-x-1/2;
  }
}
</style>
