<script setup lang="ts">
import { useFormStore } from "~~/store/form";
import CataniaHeaderCenter from "~~/components/theme/catania/header/LogoCenter.vue";
import CataniaHeaderLeft from "~~/components/theme/catania/header/LogoLeft.vue";
import CataniaFooter from "~~/components/theme/catania/footer/Footer.vue";

useFavicon();
const appMounted = ref(false);
onMounted(() => {
  appMounted.value = true;
});

const formStore = useFormStore();
const form = computed(() => formStore.form);
const theme = computed(() => form.value?.theme);

const headerType = ref<"Center" | "Left">("Left");
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
  <div>
    <!-- header -->
    <Component :is="Header" />
    <slot v-if="appMounted" />

    <Component :is="Footer" />
  </div>
</template>
