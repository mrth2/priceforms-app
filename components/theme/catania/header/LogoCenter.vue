<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
const logo = computed(() => form.value.logo?.url);
const phone = computed(() => form.value.phone);
const socials = computed(() => formStore.socialIcons);
</script>

<template>
  <div class="header header-center">
    <span class="header-cta">
      Call NOW for a <strong>FREE</strong> Consultation
      <a v-if="phone?.number" :href="`tel:${phone.number}`">
        <strong>{{ phone.label }}</strong>
      </a>
    </span>
    <NuxtLink class="header-logo" to="/">
      <img v-if="logo" :src="logo" :alt="form?.title" />
    </NuxtLink>
    <div class="header-social">
      <template
        v-for="item in socials"
        :key="item.icon"
      >
        <a
          v-if="form.socialLinks[item.type]"
          :href="formStore.getSocialUrl(item.type)"
          target="_blank"
        >
          <FaIcon class="social-icon" :icon="[item.prefix, item.icon]" size="xs" />
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.header {
  @apply w-full bg-catania-primary;
  @apply !py-3 md:!py-6 relative;

  max-width: 100vw;

  --max-side-width: calc(100vw / 2 - theme("width.36") / 2 - theme("width.4"));

  .header-cta {
    @apply text-xs sm:text-sm md:text-base text-white;

    max-width: var(--max-side-width);
  }
  .header-logo {
    @apply bg-catania-primary border-2 border-t-0 border-white w-28 md:w-40 px-2 md:px-1.5 pb-2 md:pb-4 pt-6 md:pt-12 mx-auto;
    @apply absolute left-1/2 transform -translate-x-1/2;

    img {
      @apply object-contain h-full w-full;
    }
  }

  .header-social {
    @apply flex flex-row gap-4 items-center flex-wrap justify-end;
    max-width: var(--max-side-width);

    .social-icon {
      @apply max-h-4 w-4 text-white;

      @screen md {
        @apply max-h-5 w-5;
      }
    }
  }
}
</style>
