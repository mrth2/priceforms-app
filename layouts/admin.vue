<script setup lang="ts">
import { Ref } from "nuxt3/dist/app/compat/capi";
import { IUser } from "~~/types/user";
import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  BellIcon,
  CashIcon,
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  MenuAlt2Icon,
  UsersIcon,
  XIcon,
} from "@heroicons/vue/outline";
import { SearchIcon } from "@heroicons/vue/solid";
import { useAppStore } from "~~/store/app";
import Spinner from "~~/components/icon/Spinner.vue";

const appStore = useAppStore();
const isLoading = computed(() => appStore.isLoading);

const verified = ref(false);

const router = useRouter();
const route = useRoute();
const user = useStrapiUser() as Ref<IUser>;
const fullName = computed(() => {
  if (!user.value) return "Form Owner";
  else if (user.value.firstName || user.value.lastName) {
    return `${user.value.firstName} ${user.value.lastName}`;
  }
  return user.value.username || user.value.email;
});
function requireFormOwner() {
  if (!user.value) {
    return router.push("/admin/login");
  }
  const subDomain = useSubDomain();
  if (
    !user.value.isOwner ||
    !user.value.ownedForms.length ||
    !user.value.ownedForms.includes(subDomain)
  ) {
    return router.push("/");
  }
  verified.value = true;
}

const graphql = useStrapiGraphQL();
const form = ref(null);
onMounted(() => {
  requireFormOwner();
  // on mounted, watch if user changed, require form owner again on any tab
  watch(user, requireFormOwner);
});

appStore.setLoading(true);
const { pending: loadingForm, data } = useLazyAsyncData("form", fetchForm);
watch(data, (loadedData: any) => {
  if (loadedData?.data?.forms?.data?.length) {
    form.value = {
      ...loadedData.data.forms.data[0],
    };
  }
  // update meta to load configured form favicon if available
  useMeta({
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: favicon.value || "/favicon.png",
      },
    ],
  });
  appStore.setLoading(false);
});

const logo = computed(
  () => form.value?.attributes?.logo?.data?.attributes?.url
);
const favicon = computed(
  () => form?.value?.attributes?.favicon?.data?.attributes?.url
);

async function fetchForm() {
  return await graphql(`
    fragment Image on UploadFileEntityResponse {
      data {
        attributes {
          url
        }
      }
    }
    query Form {
      forms(filters: {subDomain: {eq: "${useSubDomain()}"}}) {
        data {
          id
          attributes {
            logo {
              ...Image
            }
            favicon {
              ...Image
            }
          }
        }
      }
    }
  `);
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Submissions", href: "/admin/submissions", icon: UsersIcon },
  { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { name: "Payments", href: "/admin/payments", icon: CashIcon },
  { name: "Settings", href: "/admin/settings", icon: CogIcon },
];
const currentNavigation = computed(() =>
  navigation.find((nav) => route.matched.some(({ path }) => path === nav.href))
);
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "/admin/settings" },
  { name: "Sign out", href: "/admin/logout" },
];

const sidebarOpen = ref(false);
</script>

<template>
  <div v-if="!loadingForm">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="fixed inset-0 flex z-40 md:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <div
            class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800"
          >
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <NuxtLink to="/" class="flex-shrink-0 flex items-center px-4">
              <img
                class="h-16 max-w-full w-auto"
                :src="logo"
                alt="PriceForms"
              />
            </NuxtLink>
            <div class="mt-5 flex-1 h-0 overflow-y-auto">
              <nav class="px-2 space-y-1">
                <a
                  v-for="item in navigation"
                  :key="item.name"
                  :href="item.href"
                  :class="[
                    item.name === currentNavigation.name
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-base font-medium rounded-md',
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      item.name === currentNavigation.name
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-300',
                      'mr-4 flex-shrink-0 h-6 w-6',
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </a>
              </nav>
            </div>
          </div>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex-1 flex flex-col min-h-0 bg-gray-800">
        <NuxtLink
          to="/"
          class="flex items-center h-24 flex-shrink-0 px-4 bg-gray-900"
        >
          <img
            v-if="logo"
            class="h-16 max-w-full w-auto"
            :src="logo"
            alt="PriceForms"
          />
          <span v-else>PriceForms</span>
        </NuxtLink>
        <div class="flex-1 flex flex-col overflow-y-auto">
          <nav class="flex-1 px-2 py-4 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                item.name === currentNavigation.name
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  item.name === currentNavigation.name
                    ? 'text-gray-300'
                    : 'text-gray-400 group-hover:text-gray-300',
                  'mr-3 flex-shrink-0 h-6 w-6',
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
    <div class="md:pl-64 flex flex-col">
      <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button
          type="button"
          class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <form class="w-full flex md:ml-0" action="#" method="GET">
              <label for="search-field" class="sr-only">Search</label>
              <div
                class="relative w-full text-gray-400 focus-within:text-gray-600"
              >
                <div
                  class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
                >
                  <SearchIcon class="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                />
              </div>
            </form>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <button
              type="button"
              class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <CoreAvatar :name="fullName" class="h-8 w-8 bg-blue-100" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 !shadow-lg"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <NuxtLink
                      :to="item.href"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                    >
                      {{ item.name }}
                    </NuxtLink>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="flex-1">
        <div class="py-6">
          <div class="mx-auto px-4 sm:px-6 md:px-8">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ route.meta.title }}
            </h1>
            <p v-if="route.meta.description" class="mt-4 text-sm text-gray-700">
              {{ route.meta.description }}
            </p>
          </div>
          <!-- main page content here -->
          <div class="mx-auto px-4 sm:px-6 md:px-8">
            <div class="py-4">
              <slot v-if="verified">
                <div
                  class="border-4 border-dashed border-gray-200 rounded-lg h-96"
                />
              </slot>
            </div>
          </div>
          <!-- global admin loading -->
          <div v-if="isLoading" class="relative">
            <div
              class="fixed inset-0 flex flex-col justify-center items-center gap-3 bg-gray-900 bg-opacity-70 z-[100]"
            >
              <Spinner class="w-20 h-20" />
              <div class="text-white">Please wait a bit...</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
