<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import CataniaHeaderCenter from "~~/components/theme/catania/header/LogoCenter.vue";
import CataniaHeaderLeft from "~~/components/theme/catania/header/LogoLeft.vue";
import CataniaFooter from "~~/components/theme/catania/footer/Footer.vue";

useFavicon();
const route = useRoute();
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
      <Title>{{ route.meta.title }} | PriceForms</Title>
    </Head>
    <!-- header -->
    <Component :is="Header" />
    <div
      class="page"
      :style="{ backgroundImage: `url(/assets/images/catania/bg.png)` }"
    >
      <div class="max-w-form mx-auto">
        <slot />
      </div>
    </div>
    <Component :is="Footer" />

    <CoreNotification />
  </div>
</template>

<style scoped lang="postcss">
.container {
  @apply w-screen h-screen overflow-y-auto relative;
  max-width: 100vw;

  &.left {
    --header-height: 82px;
  }

  --site-padding: theme("padding.2");
  @screen sm {
    --site-padding: theme("padding.4");
  }
  @screen md {
    --site-padding: theme("padding.6");
  }
  @screen lg {
    --site-padding: theme("padding.8");
  }

  .page {
    @apply bg-cover pb-10;
    padding: 0 var(--site-padding);
    min-height: calc(
      100vh - var(--header-height, 72px) - var(--footer-height, 88px)
    );

    :deep(h1) {
      @apply text-catania-primary font-extrabold text-center pt-16 mb-8 text-3xl uppercase;
    }
  }

  :deep(.header) {
    @apply flex flex-row justify-between items-center;
    padding: 0 var(--site-padding);
  }
}
</style>
