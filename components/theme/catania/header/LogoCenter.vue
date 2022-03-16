<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
const logo = computed(() => form.value?.logo?.url);

const socials = computed(() => formStore.socialIcons);
</script>

<template>
  <div class="header header-center">
    <span class="header-cta">
      Call NOW for a <strong>FREE</strong> Consultation
      <strong>(813) 590-5954</strong>
    </span>
    <div class="header-logo">
      <img v-if="logo" :src="logo" :alt="form?.title" />
    </div>
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
</template>

<style scoped lang="postcss">
.header {
  @apply w-full bg-catania-primary;
  @apply !py-6 relative;

  max-width: 100vw;

  --max-side-width: calc(100vw / 2 - theme("width.36") / 2 - theme("width.4"));

  .header-cta {
    @apply text-base text-white;

    max-width: var(--max-side-width);
  }
  .header-logo {
    @apply bg-catania-primary border-2 border-t-0 border-white w-36 px-4 pb-4 pt-12 mx-auto;
    @apply absolute left-1/2 transform -translate-x-1/2;

    img {
      @apply object-contain h-full w-full;
    }
  }

  .header-social {
    @apply flex flex-row gap-4 items-center flex-wrap justify-end;
    max-width: var(--max-side-width);

    .social-icon {
      @apply max-h-5 w-5 text-white;
    }
  }
}
</style>
