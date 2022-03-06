<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
const { logout } = useStrapiAuth()
logout()
</script>
<template>
  <div></div>
</template>