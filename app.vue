<script setup>
import { useFormStore } from "./store/form";

const formStore = useFormStore();
const font = computed(() => formStore.form.font);
const primaryColor = computed(() => formStore.form.color?.primary || 'var(--catania-primary-color-default)');
// append root font config
onMounted(() => {
  if (font.value) {
    const style = document.createElement("style");
    style.innerHTML = `
    :root {
      --font-family: "${font.value}", sans-serif;
    }
  `;
    document.head.appendChild(style);
  }
});
</script>

<template>
  <div :style="{ '--catania-primary-color': primaryColor }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
