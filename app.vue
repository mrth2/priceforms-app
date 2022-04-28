<script setup>
import { useFormStore } from "./store/form";

const formStore = useFormStore();
const font = computed(() => formStore.form.font);
// append root font config
onMounted(() => {
  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --font-family: "${font.value}", sans-serif;
    }
  `;
  document.head.appendChild(style);
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
