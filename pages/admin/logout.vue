<script setup lang="ts">
const { logout } = useStrapiAuth()
logout()
const router = useRouter()
router.push('/admin/login')
</script>
<template>
  <div></div>
</template>