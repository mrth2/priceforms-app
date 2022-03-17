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
const progressBar = ref();
const indicatorTranslateX = ref(null);
onMounted(() => {
  console.log(progressBar.value.offsetWidth);
  indicatorTranslateX.value =
    Math.ceil((progressBar.value.offsetWidth * props.progress) / 100) - 12; // minus 12px for the half circle
});
</script>

<template>
  <div ref="progressBar" class="progress-bar">
    <div class="progress">
      <div class="active" :style="{ width: `${progress}%` }" />
      <div
        class="indicator"
        :style="{
          transform: indicatorTranslateX
            ? `translateX(${indicatorTranslateX}px)`
            : null,
        }"
      />
      <div class="slide" />
    </div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped lang="postcss">
.progress-bar {
  @apply pt-12 pb-4;

  .progress {
    @apply relative w-full h-3 drop-shadow mb-2;
    .slide {
      @apply bg-gray-200 h-full rounded-lg;
    }
    .active {
      @apply rounded-lg bg-catania-button h-3 absolute top-0;
    }
    .indicator {
      @apply bg-catania-button absolute h-6 w-6 rounded-full left-0 -top-1.5;
    }
  }
  .label {
    @apply text-xs font-semibold text-catania-secondary tracking-wide leading-tight uppercase;
  }
}
</style>
