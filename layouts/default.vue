<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import CataniaHeaderCenter from "~~/components/theme/catania/header/LogoCenter.vue";
import CataniaHeaderLeft from "~~/components/theme/catania/header/LogoLeft.vue";
import CataniaFooter from "~~/components/theme/catania/footer/Footer.vue";

useFavicon();
const formStore = useFormStore();
const form = computed(() => formStore.form);
const theme = computed(() => form.value?.theme);
const headerType = computed(() => formStore.headerType);
const Header = computed(() =>
  theme.value
    ? theme.value === "catania"
      ? headerType.value === "Center"
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
  <div v-if="form" class="container scroller">
    <!-- header -->
    <Component :is="Header" />
    <div
      class="page"
      :style="{ backgroundImage: `url(/assets/images/catania/bg.png)` }"
    >
      <slot />
    </div>
    <Component :is="Footer" />
  </div>
</template>

<style scoped lang="postcss">
.container {
  @apply min-h-screen overflow-y-auto;
  max-width: 100vw;

  .page {
    @apply bg-cover;
    min-height: calc(
      100vh - var(--header-height, 82px) - var(--footer-height, 88px)
    );
  }
}
</style>
