<script setup>
useFavicon();
const user = useStrapiUser();
const router = useRouter();
if (user.value) {
  router.push("/admin");
}
</script>
<template>
  <div class="bg-gray-800 text-white min-h-screen">
    <slot />
  </div>
</template>
