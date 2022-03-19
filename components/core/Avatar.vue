<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
const text = computed(() => {
  if (!props.name) return "U";
  return props.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
});
</script>
<template>
  <div
    class="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center font-semibold tracking-wide"
  >
    {{ text }}
  </div>
</template>
