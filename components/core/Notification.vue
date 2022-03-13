<script setup lang="ts">
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  XIcon,
} from "@heroicons/vue/solid";
import { useAppStore } from "~~/store/app";
const appStore = useAppStore();

const notifications = computed(() =>
  appStore.notifications.map((n) => {
    let icon, iconClass, border;
    switch (n.type) {
      case "success":
        icon = CheckCircleIcon;
        iconClass = "text-green-500";
        border = "border-green-500";
        break;
      case "info":
        icon = InformationCircleIcon;
        iconClass = "text-blue-500";
        border = "border-blue-500";
        break;
      case "warning":
        icon = ExclamationCircleIcon;
        iconClass = "text-yellow-500";
        border = "border-yellow-500";
        break;
      case "error":
        icon = ExclamationIcon;
        iconClass = "text-red-500";
        border = "border-red-500";
        break;
    }
    return {
      ...n,
      icon,
      class: iconClass,
      border,
    };
  })
);
const show = computed(() => !!notifications.value.length);

const route = useRoute();
const routeChanged = ref(0);
// when route change two times, clear toasts automatically
watch(
  () => route.fullPath,
  () => {
    routeChanged.value++;
    if (routeChanged.value === 2) {
      // appStore.clearNotifications();
      routeChanged.value = 0;
    }
  }
);
</script>

<template>
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[999]"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="show"
          class="max-w-sm w-full pointer-events-auto overflow-hidden"
        >
          <div
            v-for="(item, index) in notifications"
            :key="index"
            class="p-4 mb-4 border bg-white shadow-lg rounded-lg"
            :class="[item.border]"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <Component
                  :is="item.icon"
                  class="h-6 w-6"
                  :class="[item.class]"
                  aria-hidden="true"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ item.title }}
                </p>
                <p v-if="item.message" class="mt-1 text-sm text-gray-500">
                  {{ item.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="appStore.removeNotification(index)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <XIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
