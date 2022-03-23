<script setup lang="ts">
import { IFormBanner } from "~~/types/form";

const props = defineProps<{
  banner: IFormBanner;
}>();

const isVideo = computed(() => props.banner.media.url.includes(".mp4"));
const isImage = computed(
  () =>
    props.banner.media.url.includes(".jpg") ||
    props.banner.media.url.includes(".png")
);
const isYoutube = computed(() =>
  props.banner.remoteVideo?.includes("youtube.com")
);
const isVimeo = computed(() => props.banner.remoteVideo?.includes("vimeo.com"));
const isRemoteVideo = computed(() => isYoutube.value || isVimeo.value);
const embedLink = computed(() => {
  if (isYoutube.value) {
    return props.banner.remoteVideo.replace(
      /www.youtube.com\/watch\?v=(.*)/g,
      `www.youtube-nocookie.com/embed/$1?controls=0&mute=1${
        props.banner.autoplay ? "&autoplay=1" : ""
      }`
    );
  } else if (isVimeo.value) {
    return props.banner.remoteVideo.replace(
      /\/\/vimeo.com\/(\d+)/g,
      `//player.vimeo.com/video/$1?h=c0c7c63ea5${
        props.banner.autoplay ? "&autoplay=1" : ""
      }&color=4690CB`
    );
  }
});
</script>

<template>
  <div class="banner" :class="{ remote: isRemoteVideo }">
    <iframe
      v-if="isRemoteVideo"
      :src="embedLink"
      title="Banner"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <video
      v-else-if="isVideo"
      controls
      :autoplay="banner.autoplay"
      :muted="banner.autoplay"
    >
      <source :src="banner.media.url" type="video/mp4" />
    </video>
    <img v-else-if="isImage" :src="banner.media.url" />
    <p v-else-if="banner.text">{{ banner.text }}</p>
  </div>
</template>

<style scoped lang="postcss">
.banner {
  @apply max-w-full w-full max-h-[400px] h-full relative my-4 overflow-hidden;
  &.remote {
    @apply w-full !max-h-full h-0;
    padding-bottom: 56.25%;
  }

  img {
    @apply object-cover w-full h-full;
  }
  iframe {
    @apply absolute inset-0 w-full h-full;
  }
}
</style>
