<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import { IFormBanner } from "~~/types/form";

const props = defineProps<{
  banner: IFormBanner;
}>();

const formStore = useFormStore();
const form = computed(() => formStore.form);
const isVideo = computed(() =>
  form.value.introBanner.media.url.includes(".mp4")
);
const isImage = computed(
  () =>
    form.value.introBanner.media.url.includes(".jpg") ||
    form.value.introBanner.media.url.includes(".png")
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
      }&color=4690CB&title=0&byline=0&portrait=1`
    );
  }
});
</script>

<template>
  <div class="banner">
    <iframe
      v-if="isRemoteVideo"
      width="100%"
      height="100%"
      :src="embedLink"
      title="Banner"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <video v-else-if="isVideo">
      <source :src="form.introBanner.media.url" type="video/mp4" />
    </video>
    <img v-else-if="isImage" :src="form.introBanner.media.url" />
    <p v-else-if="form.introBanner.text">{{ form.introBanner.text }}</p>
  </div>
</template>

<style scoped lang="postcss">
.banner {
  @apply max-w-full max-h-[400px] h-full relative py-4 overflow-hidden;

  img {
    @apply object-cover w-full h-full;
  }
}
</style>
