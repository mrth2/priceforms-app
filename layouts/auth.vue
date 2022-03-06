<script setup>
const user = useStrapiUser()
const router = useRouter()
if (user.value) {
  // router.push('/admin')
}
</script>
<template>
  <div>
    <slot />
  </div>
</template>