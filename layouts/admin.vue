<script setup lang="ts">
import { Ref } from 'nuxt3/dist/app/compat/capi';
import { IUser } from '~~/types/user';

const verified = ref(false)

const router = useRouter()
const user = useStrapiUser() as Ref<IUser>
function requireFormOwner() {
  if (!user.value) {
    router.push('/admin/login')
  }
  const subDomain = useSubDomain()
  if (!user.value.isOwner || !user.value.ownedForms.length || !user.value.ownedForms.includes(subDomain)) {
    router.push('/')
    return
  }
  verified.value = true
}
onMounted(() => {
  requireFormOwner()
  watch(user, requireFormOwner)
})
</script>
<template>
  <div>
    <slot v-if="verified" />
  </div>
</template>