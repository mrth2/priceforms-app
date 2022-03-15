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

const zipHint = computed(() => form.value.zip.find((item) => item.hint)?.hint);

const inputCode = ref("");

async function checkZip() {}
</script>

<template>
  <div>
    <h1>{{ form.title }}</h1>
    <div class="intro">
      <div class="intro-banner">
        <video v-if="isVideo">
          <source :src="form.introBanner.media.url" type="video/mp4" />
        </video>
        <img v-if="isImage" :src="form.introBanner.media.url" />
        <p v-if="form.introBanner.text">{{ form.introBanner.text }}</p>
      </div>
      <div class="form-register">
        <form>
          <h3>ENTER YOUR ZIP CODE TO BEGIN</h3>
          <div class="form-group">
            <div class="form-input">
              <input
                v-model.trim="inputCode"
                type="text"
                placeholder="Enter zip code"
              />
            </div>
            <CoreButton class="uppercase">
              {{ form.button.joining }}
            </CoreButton>
          </div>
          <div class="agreement">
            <input type="checkbox" />
            <span>{{ form.term }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply text-catania-primary font-extrabold text-center mt-10 mb-4 text-2xl;
}
.intro {
  @apply max-w-form grid grid-cols-2 bg-white px-4 mx-auto items-center rounded shadow-main;

  .intro-banner {
    @apply h-[400px] relative py-4;

    img {
      @apply object-cover w-full h-full;
    }
  }
  .form-register {
    @apply pl-4 text-center;

    h3 {
      @apply text-catania-primary font-extrabold text-lg;
    }

    .form-group {
      @apply mt-4 grid grid-cols-2 gap-4;

      input {
        @apply w-full border border-catania-outline rounded flex items-center h-10 indent-2 focus:outline-catania-primary text-sm;
      }
    }
    .agreement {
      @apply mt-4 relative;

      input[type="checkbox"] {
        @apply h-5 w-5 border-catania-outline absolute top-1;
      }

      span {
        @apply text-xs leading-3 text-catania-secondary ml-6;
      }
    }
  }
}
</style>
