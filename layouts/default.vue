<script setup>
const appMounted = ref(false)
onMounted(() => {
  appMounted.value = true
})
</script>
<template>
  <div>
    <slot v-if="appMounted" />
  </div>
</template>
