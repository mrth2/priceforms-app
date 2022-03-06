<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { login } = useStrapiAuth()
const router = useRouter()

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const onSubmit = async () => {
  try {
    loading.value = true
    await login({
      identifier: identifier.value,
      password: password.value
    })
    router.push('/admin')
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}
const subdomain = ref('')
onMounted(() => {
  subdomain.value = useSubdomain()
})
</script>

<template>
  <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 class="mt-6 text-center text-3xl font-semibold text-gray-900">
          Sign in to
          <span class="capitalize font-semibold underline">{{ subdomain }}</span> dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <a
            href="/join-us"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >become our new awesome client!</a>
        </p>
      </div>
      <form @submit.prevent="onSubmit" class="mt-8 space-y-6">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              v-model.trim="identifier"
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              v-model.trim="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>

          <div class="text-sm">
            <a
              href="#"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >Forgot your password?</a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3 text-white">
              <IconSpinner v-if="loading" />
              <IconLock v-else />
            </span>
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>