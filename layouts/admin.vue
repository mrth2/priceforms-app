<script setup lang="ts">
const router = useRouter()
const user = useStrapiUser()
function requireAuth() {
  if (!user.value) {
    router.push('/admin/login')
  }
}
watch(user, requireAuth)
onMounted(requireAuth)
</script>
<template>
  <div>
    <slot />
  </div>
</template>