<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
const logo = computed(() => form.value?.logo?.url);

const socials = computed(() => formStore.socialIcons);
</script>

<template>
  <div class="bg-catania-primary">
    <div class="header header-left">
      <div class="header-logo">
        <img v-if="logo" :src="logo" :alt="form?.title" />
      </div>
      <div class="flex flex-col ml-auto py-4 gap-2">
        <span class="header-cta">
          Call NOW for a FREE Consultation
          <strong>(813) 590-5954</strong>
        </span>
        <div class="header-social">
          <a
            v-for="item in socials"
            :key="item.icon"
            :href="formStore.getSocialUrl(item.type)"
            target="_blank"
          >
            <FaIcon class="social-icon" :icon="['fab', item.icon]" size="xs" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.header {
  @apply max-w-form mx-auto;

  .header-cta {
    @apply text-base text-white font-extralight;

    strong {
      @apply font-bold;
    }
  }
  .header-logo {
    @apply bg-catania-primary w-36 px-4 pb-4 pt-12 mx-auto;
    @apply absolute rounded-b-xl;

    img {
      @apply object-contain h-full w-full;
    }
  }

  .header-social {
    @apply flex flex-row gap-4 items-center flex-wrap justify-end;
    .social-icon {
      @apply w-4 max-h-4 text-white;
    }
  }
}
</style>
