<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);
const logo = computed(() => form.value.logo?.url);
const phone = computed(() => form.value.phone);
const socials = computed(() => formStore.socialIcons);
</script>

<template>
  <div class="bg-catania-primary">
    <div class="header header-left">
      <NuxtLink class="header-logo" to="/">
        <img v-if="logo" :src="logo" :alt="form?.title" />
      </NuxtLink>
      <div class="header-right">
        <span class="header-cta">
          Call NOW for a FREE Consultation
          <a :href="`tel:${phone.number}`">
            <strong>{{ phone.label }}</strong>
          </a>
        </span>
        <div class="header-social">
          <a
            v-for="item in socials"
            :key="item.icon"
            :href="formStore.getSocialUrl(item.type)"
            target="_blank"
          >
            <FaIcon class="social-icon" :icon="[item.prefix, item.icon]" size="xs" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.header {
  @apply max-w-form mx-auto;

  .header-right {
    @apply flex flex-col ml-auto py-2 md:py-4 gap-2 pl-28;
  }

  .header-cta {
    @apply text-xs sm:text-sm md:text-base text-white font-extralight text-right;

    strong {
      @apply font-bold;
    }
  }
  .header-logo {
    @apply bg-catania-primary w-28 md:w-36 px-2 md:px-4 pb-2 md:pb-4 pt-6 md:pt-12 mx-auto;
    @apply absolute rounded-b-xl;

    img {
      @apply object-contain h-full w-full;
    }
  }

  .header-social {
    @apply flex flex-row gap-4 items-center flex-wrap justify-end;
    .social-icon {
      @apply text-white w-3 max-h-3;
      @screen md {
        @apply w-4 max-h-4;
      }
    }
  }
}
</style>
