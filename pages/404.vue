<script setup lang="ts">
definePageMeta({
  layout: "error",
});
</script>

<template>
  <div
    class="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8"
  >
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-catania-primary sm:text-5xl">404</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1
              class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl"
            >
              Page not found
            </h1>
            <p class="mt-1 text-base text-gray-500">
              Sorry, the URL you were trying to reach does not exist.
            </p>
          </div>
          <div
            class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6"
          >
            <a
              href="mailto:admin@priceforms.net"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-catania-primary hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-catania-primary"
            >
              Contact support
            </a>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
