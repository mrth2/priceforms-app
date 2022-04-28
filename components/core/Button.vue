<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const props = withDefaults(
  defineProps<{
    isSubmit?: boolean;
    icon?: any;
    type?: "primary" | "secondary" | "delete" | "ghost" | "outline";
    loading?: boolean;
  }>(),
  {
    isSubmit: false,
    type: "primary",
    loading: false,
  }
);
defineEmits(["click"]);
const form = computed(() => useFormStore().form);
const color = computed(() => form.value.color);
const buttonClass = computed(() => {
  const result = [];
  if (props.loading) result.push("cursor-wait", "loading");
  switch (props.type) {
    case "primary":
      if (color.value?.button === "red") {
        result.push("bg-catania-button-red");
      } else {
        result.push("bg-catania-button-blue");
      }
      result.push("hover:bg-opacity-80", "text-white");
      break;
    case "secondary":
      result.push("bg-gray-300", "hover:bg-gray-600", "text-white");
      break;
    case "delete":
      result.push("bg-red-600", "hover:bg-red-400", "text-white");
      break;
    case "ghost":
      result.push("bg-transparent");
      break;
    case "outline":
      result.push("border-2", "border-gray-300", "hover:border-gray-600");
      break;
  }
  return result;
});
</script>
<template>
  <button
    :type="isSubmit ? 'submit' : 'button'"
    class="relative inline-flex justify-center items-center px-4 py-2 shadow text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <Component
      v-if="!!icon"
      :is="icon"
      class="-ml-1 mr-2 h-5 w-5"
      aria-hidden="true"
    />
    <div class="btn-content">
      <slot />
    </div>
    <div v-if="loading" class="loading-icon">
      <IconSpinner class="!m-0" />
    </div>
  </button>
</template>

<style scoped lang="postcss">
button.loading > .btn-content {
  @apply opacity-0;
}
.loading-icon {
  @apply absolute m-auto;
}
</style>
