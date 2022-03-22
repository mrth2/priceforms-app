<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const formStore = useFormStore();
const submissionStore = useSubmissionStore();
const submission = submissionStore.submission;
const translation = computed(() => formStore.form.thankyouPage);
const banner = computed(() => formStore.form.thankyouBanner);
const isVideo = computed(() => banner.value.media.url.includes(".mp4"));
const isImage = computed(
  () =>
    banner.value.media.url.includes(".jpg") ||
    banner.value.media.url.includes(".png")
);
const isYoutube = computed(() => banner.value.youtube);
const youtubeEmbedLink = computed(() =>
  banner.value.youtube.replace(
    /www.youtube.com\/watch\?v=(.*)/g,
    "www.youtube-nocookie.com/embed/$1?controls=0"
  )
);
</script>

<template>
  <div>
    <h1>
      {{
        translation.title.replace(/\[NAME\]/g, $fullname(submission.subscriber))
      }}
    </h1>
    <p class="message">{{ translation.message }}</p>
    <div class="banner">
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
      <img v-else-if="banner.media" :src="banner.media.url" alt="Thank you" />
      <p v-else-if="banner.text">{{ banner.text }}</p>
    </div>
    <div class="actions">
      <a :href="translation.returnLink || '/'" target="_blank">
        <CoreButton class="bg-catania-primary">
          {{ translation.buttonReturn }}
        </CoreButton>
      </a>
      <a :href="translation.promoLink || '/'" target="_blank">
        <CoreButton>
          {{ translation.buttonPromo }}
        </CoreButton>
      </a>
    </div>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply !mb-0;
}
.message {
  @apply text-center mb-6;
}
.banner {
  @apply flex flex-col items-center justify-center;
  img {
    @apply w-full h-96 object-cover relative;
  }
}
.actions {
  @apply flex justify-center gap-4 mt-6;
}
</style>
