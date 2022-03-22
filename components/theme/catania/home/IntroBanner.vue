<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
const hasMedia = computed(() => form.value.introBanner.media);
const isVideo = computed(() =>
  form.value.introBanner.media.url.includes(".mp4")
);
const isImage = computed(
  () =>
    form.value.introBanner.media.url.includes(".jpg") ||
    form.value.introBanner.media.url.includes(".png")
);
</script>

<template>
  <div class="intro-banner">
    <video v-if="isVideo">
      <source :src="form.introBanner.media.url" type="video/mp4" />
    </video>
    <img v-if="isImage" :src="form.introBanner.media.url" />
    <p v-if="form.introBanner.text">{{ form.introBanner.text }}</p>
  </div>
</template>

<style scoped lang="postcss">
.intro-banner {
  @apply max-w-full max-h-[400px] h-full relative py-4 overflow-hidden;

  img {
    @apply object-cover w-full h-full;
  }
}
</style>
