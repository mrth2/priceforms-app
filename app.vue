<script setup>
import { useFormStore } from "./store/form";

const formStore = useFormStore();
const font = computed(() => formStore.form.font);
const color = computed(() => formStore.form.color);
console.log(color.value);
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

<style scoped lang="postcss">
/deep/ .btn {
  @apply text-white font-bold py-1 px-4 rounded text-sm leading-5;

  &.btn-primary {
    @apply !bg-red-900 hover:!bg-red-700;
  }
}
</style>
