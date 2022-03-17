<script setup lang="ts">
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
const buttonClass = computed(() => {
  const result = [];
  if (props.loading) result.push("cursor-wait");
  switch (props.type) {
    case "primary":
      result.push("bg-catania-button", "hover:bg-opacity-80", "text-white");
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
      result.push("border", "border-gray-300", "hover:border-gray-600");
      break;
  }
  return result;
});
</script>
<template>
  <button
    :type="isSubmit ? 'submit' : 'button'"
    class="inline-flex justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
    :class="buttonClass"
    @click="$emit('click')"
  >
    <Component
      v-if="!!icon"
      :is="icon"
      class="-ml-1 mr-2 h-5 w-5"
      aria-hidden="true"
    />
    <slot />
    <div class="ml-2">
      <IconSpinner class="!m-0" v-if="loading" />
    </div>
  </button>
</template>
