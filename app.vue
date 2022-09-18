<script setup>
import { useFormStore } from "./store/form";

const formStore = useFormStore();
const font = computed(() => formStore.form?.font);
const primaryColor = computed(() => formStore.form?.color?.primary || 'var(--catania-primary-color-default)');
const accentColor = computed(() => {
  switch(formStore.form?.color?.button) {
    case 'primary':
      return primaryColor.value;
    case 'blue':
      return 'var(--catania-accent-color-blue)';
    case 'red':
      return 'var(--catania-accent-color-red)';
    default:
      return 'var(--catania-accent-color-default)';
  }
})
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
  <div :style="{
    '--catania-primary-color': primaryColor,
    '--catania-accent-color': accentColor,
  }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
