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
const isYoutube = computed(() => form.value.introBanner.youtube);
const youtubeEmbedLink = computed(() => form.value.introBanner.youtube.replace(/www.youtube.com\/watch\?v=(.*)/g, "www.youtube-nocookie.com/embed/$1?controls=0"));
</script>

<template>
  <div class="intro-banner">
    <iframe
      v-if="isYoutube"
      width="100%"
      height="368"
      :src="youtubeEmbedLink"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <video v-else-if="isVideo">
      <source :src="youtubeEmbedLink" type="video/mp4" />
    </video>
    <img v-else-if="isImage" :src="form.introBanner.media.url" />
    <p v-else-if="form.introBanner.text">{{ form.introBanner.text }}</p>
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
