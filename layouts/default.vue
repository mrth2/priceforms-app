<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import CataniaHeaderCenter from "~~/components/theme/catania/header/LogoCenter.vue";
import CataniaHeaderLeft from "~~/components/theme/catania/header/LogoLeft.vue";
import CataniaFooter from "~~/components/theme/catania/footer/Footer.vue";
import { useAppStore } from "~~/store/app";
useFavicon();
const route = useRoute();
const pageTitle = computed(() => useAppStore().pageTitle || route.meta.title);
// on route change, immediately unset page title
watch(
  () => route.fullPath,
  () => {
    useAppStore().setPageTitle(null);
  },
  { immediate: true }
);
const formStore = useFormStore();
const form = computed(() => formStore.form);
const theme = computed(() => form.value.theme);
const headerType = computed(() => formStore.getHeaderStyle);
const Header = computed(() =>
  theme.value
    ? theme.value === "catania"
      ? headerType.value === "logoCenter"
        ? CataniaHeaderCenter
        : CataniaHeaderLeft
      : null
    : null
);
const Footer = computed(() =>
  theme.value === "catania" ? CataniaFooter : null
);
</script>
<template>
  <div
    v-if="form"
    class="container scroller"
    :class="{
      center: headerType === 'logoCenter',
      left: headerType === 'logoLeft',
    }"
  >
    <Head>
      <Title>{{ pageTitle }} | PriceForms</Title>
    </Head>
    <!-- header -->
    <Component v-if="!$isEmbedMode" :is="Header" />
    <div
      class="page"
      :class="{
        embed: $isEmbedMode,
      }"
      :style="{ backgroundImage: `url(/assets/images/catania/bg.png)` }"
    >
      <div class="max-w-form mx-auto">
        <slot />
      </div>
    </div>
    <Component v-if="!$isEmbedMode" :is="Footer" />

    <CoreNotification />
  </div>
</template>

<style scoped lang="postcss">
.container {
  @apply w-screen h-screen overflow-y-auto relative;
  max-width: 100vw;

  &.left {
    --header-height: 70px;

    @screen 2xs {
      --header-height: 55px;
    }

    @screen md {
      --header-height: 82px;
    }
  }

  --site-padding: theme("padding.2");
  --footer-height: 56px;
  @screen sm {
    --site-padding: theme("padding.4");
  }
  @screen md {
    --site-padding: theme("padding.6");
    --footer-height: 88px;
  }
  @screen lg {
    --site-padding: theme("padding.8");
  }

  .page {
    padding: 0 var(--site-padding);
    @apply bg-cover pb-5;
    min-height: calc(
      100vh - var(--header-height, 72px) - var(--footer-height, 88px)
    );
    &.embed {
      @apply !min-h-screen;
    }

    :deep(h1) {
      @apply text-catania-primary font-extrabold text-center pt-6 md:pt-12 lg:pt-16 mb-4 md:mb-6 lg:mb-8 text-xl md:text-3xl uppercase;
    }
  }

  :deep(.header) {
    @apply flex md:flex-row justify-between items-center;
    padding: 0 var(--site-padding);

    &.header-center {
      @screen max-sm {
        @apply static flex-col mt-8 !p-0 items-start;

        .header-cta {
          @apply absolute inset-0 bottom-auto text-catania-primary max-w-none text-base tracking-tighter pt-1 text-center;
        }
        .header-logo {
          @apply w-40 pt-2;
        }
        .header-social {
          @apply max-w-none py-7 pl-3 pr-5 w-full gap-3;

          & > a:nth-child(4) {
            @apply ml-auto;
          }

          .social-icon {
            @apply w-[18px] max-h-[18px];

            &[data-icon="youtube"] {
              @apply w-5 max-h-5;
            }
          }
        }
      }
      @media screen and (max-width: 360px) {
        .header-cta {
          @apply text-xs pt-2;
        }
        .header-logo {
          @apply w-32;
        }
        .header-social {
          @apply px-2 gap-1.5 py-5;
          .social-icon {
            @apply w-4 max-h-4;

            &[data-icon="youtube"] {
              @apply w-5 max-h-5;
            }
          }
        }
      }
    }
  }
}
</style>
