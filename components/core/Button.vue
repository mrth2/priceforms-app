<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isSubmit?: boolean;
    icon?: any;
    type?: "primary" | "secondary" | "delete" | "ghost" | "outline";
  }>(),
  {
    isSubmit: false,
    type: "primary",
  }
);
defineEmits(["click"]);
const buttonClass = computed(() => {
  switch (props.type) {
    case "primary":
      return "bg-blue-600 hover:bg-blue-400 text-white";
    case "secondary":
      return "bg-gray-300 hover:bg-gray-600 text-white";
    case "delete":
      return "bg-red-600 hover:bg-red-400 text-white";
    case "ghost":
      return "bg-transparent";
    case "outline":
      return "border border-gray-300 hover:border-gray-600";
  }
});
</script>
<template>
  <button
    :type="isSubmit ? 'submit' : 'button'"
    class="inline-flex justify-center px-4 py-2 shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
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
  </button>
</template>
