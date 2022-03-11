<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon, DownloadIcon } from "@heroicons/vue/outline";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import "vue-datepicker-ui/lib/vuedatepickerui.css";
import DatePicker from "vue-datepicker-ui";

type StatusOption = "register" | "partial" | "complete";
const props = withDefaults(
  defineProps<{
    status: Array<StatusOption>;
    limit?: number;
    progress?: {
      min: number;
      max: number;
    };
  }>(),
  {
    limit: 10,
  }
);
const dates = ref([]);
const emit = defineEmits([
  "change-status",
  "change-limit",
  "export",
  "change-date",
]);
watch(dates, (values) => {
  if (values.length === 2 && values[0] && values[1]) {
    emit("change-date", dates.value);
  }
});

const filterStatus = computed(() => ({
  id: "status",
  name: "status",
  options: [
    {
      value: "register" as StatusOption,
      label: "Register",
      checked: props.status.includes("register"),
      color: "!bg-cyan-200 text-cyan-800",
    },
    {
      value: "partial" as StatusOption,
      label: "Partial",
      checked: props.status.includes("partial"),
      color: "!bg-blue-200 text-blue-800",
    },
    {
      value: "complete" as StatusOption,
      label: "Complete",
      checked: props.status.includes("complete"),
      color: "!bg-green-200 text-green-800",
    },
  ],
}));
function updateFilter(id: string, option: StatusOption) {
  if (id === "status") {
    if (props.status.includes(option)) {
      emit(
        "change-status",
        props.status.filter((s) => s !== option)
      );
    } else {
      emit("change-status", [...props.status, option]);
    }
  }
}

const activeStatusFilter = computed(() => {
  const result = [];
  filterStatus.value.options.forEach((o) => {
    if (o.checked) {
      result.push({
        label: o.label,
        value: o.value,
        color: o.color,
      });
    }
  });
  return result;
});

const limits = [5, 10, 20, 50, 100, 200];

const open = ref(false);
</script>
<template>
  <div class="bg-white my-8">
    <!-- Mobile filter dialog -->
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed inset-0 flex z-40 sm:hidden"
        @close="open = false"
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
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <div
            class="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto"
          >
            <div class="px-4 flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                class="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                @click="open = false"
              >
                <span class="sr-only">Close menu</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Filters -->
            <form class="mt-4">
              <Disclosure
                as="div"
                class="border-t border-gray-200 px-4 py-6"
                v-slot="{ open }"
              >
                <h3 class="-mx-2 -my-3 flow-root">
                  <DisclosureButton
                    class="px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400"
                  >
                    <span class="font-medium text-gray-900 capitalize">
                      {{ filterStatus.name }}
                    </span>
                    <span class="ml-6 flex items-center">
                      <ChevronDownIcon
                        :class="[
                          open ? '-rotate-180' : 'rotate-0',
                          'h-5 w-5 transform',
                        ]"
                        aria-hidden="true"
                      />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel class="pt-6">
                  <div class="space-y-6">
                    <div
                      v-for="(option, optionIdx) in filterStatus.options"
                      :key="option.value"
                      class="flex items-center"
                    >
                      <input
                        :id="`filter-mobile-${filterStatus.id}-${optionIdx}`"
                        :name="`${filterStatus.id}[]`"
                        :value="option.value"
                        type="checkbox"
                        :checked="option.checked"
                        class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                        @change="updateFilter(filterStatus.id, option.value)"
                      />
                      <label
                        :for="`filter-mobile-${filterStatus.id}-${optionIdx}`"
                        class="ml-3 text-sm text-gray-500"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </div>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>

    <!-- Filters -->
    <section aria-labelledby="filter-heading">
      <h2 id="filter-heading" class="sr-only">Filters</h2>

      <div class="relative z-10 bg-white border-b border-gray-200 pb-4">
        <div class="mx-auto flex items-center justify-start gap-4">
          <button
            type="button"
            class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
            @click="open = true"
          >
            Filters
          </button>

          <!-- filter by status -->
          <div class="hidden sm:block">
            <div class="flow-root">
              <PopoverGroup
                class="-mx-4 flex items-center divide-x divide-gray-200"
              >
                <Popover class="px-4 relative inline-block text-left">
                  <PopoverButton
                    class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <span class="capitalize">
                      {{ filterStatus.name }}
                    </span>
                    <span
                      class="ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums"
                    >
                      {{ activeStatusFilter.length }}
                    </span>
                    <ChevronDownIcon
                      class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <PopoverPanel
                      class="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 border border-gray-300 focus:outline-none"
                    >
                      <form class="space-y-4">
                        <div
                          v-for="(option, optionIdx) in filterStatus.options"
                          :key="option.value"
                          class="flex items-center cursor-pointer"
                        >
                          <input
                            :id="`filter-status-${optionIdx}`"
                            :name="`${filterStatus.id}[]`"
                            :value="option.value"
                            type="checkbox"
                            :checked="option.checked"
                            class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            @change="
                              updateFilter(filterStatus.id, option.value)
                            "
                          />
                          <label
                            :for="`filter-${filterStatus.id}-${optionIdx}`"
                            class="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap capitalize"
                          >
                            {{ option.label }}
                          </label>
                        </div>
                      </form>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </PopoverGroup>
            </div>
          </div>
          |
          <!-- per page -->
          <div class="hidden sm:block">
            <div class="flow-root">
              <PopoverGroup
                class="-mx-4 flex items-center divide-x divide-gray-200"
              >
                <Popover class="px-4 relative inline-block text-left">
                  <PopoverButton
                    class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <span class="capitalize"> Per page: </span>
                    <span
                      class="ml-1.5 rounded py-0.5 px-1.5 bg-gray-200 text-xs font-semibold text-gray-700 tabular-nums"
                    >
                      {{ limit }}
                    </span>
                    <ChevronDownIcon
                      class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </PopoverButton>

                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <PopoverPanel
                      class="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl py-2 border border-gray-300 focus:outline-none"
                    >
                      <PopoverButton
                        as="div"
                        v-for="option in limits"
                        :key="option"
                        class="filter-option"
                        @click="emit('change-limit', option)"
                      >
                        {{ option }}
                      </PopoverButton>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </PopoverGroup>
            </div>
          </div>
          <div class="date-picker ml-auto">
            <DatePicker
              v-model="dates"
              :range="true"
              position="right"
              lang="en"
            />
          </div>
          <div>
            <PopoverGroup>
              <Popover>
                <PopoverButton as="button" class="btn btn-primary">
                  Download
                  <DownloadIcon class="w-4 h-4 inline-block mb-1" />
                </PopoverButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <PopoverPanel
                    class="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl py-2 border border-gray-300 focus:outline-none"
                  >
                    <PopoverButton
                      as="div"
                      class="filter-option"
                      @click="emit('export', 'pdf')"
                    >
                      Save as PDF
                    </PopoverButton>
                    <PopoverButton
                      as="div"
                      class="filter-option"
                      @click="emit('export', 'csv')"
                    >
                      Save as CSV
                    </PopoverButton>
                  </PopoverPanel>
                </transition>
              </Popover>
            </PopoverGroup>
          </div>
        </div>
      </div>

      <!-- Active filters -->
      <div>
        <div class="mx-auto py-3 sm:flex sm:items-center">
          <h3
            class="text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Selected
            <span class="sr-only">, active</span>
          </h3>

          <div
            aria-hidden="true"
            class="hidden w-px h-5 bg-gray-300 sm:block sm:ml-4"
          />

          <div class="mt-2 sm:mt-0 sm:ml-4">
            <div class="-m-1 flex flex-wrap items-center">
              <span
                v-for="status in activeStatusFilter"
                :key="status.value"
                class="m-1 inline-flex rounded-full border border-gray-200 items-center py-1 pl-3 pr-2 text-xs font-semibold"
                :class="[status.color]"
              >
                <span>{{ status.label }}</span>
                <button
                  type="button"
                  class="flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                  @click="updateFilter(filterStatus.id, status.value)"
                >
                  <span class="sr-only">
                    Remove filter for {{ status.label }}
                  </span>
                  <svg
                    class="h-2 w-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 8 8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-width="1.5"
                      d="M1 1l6 6m0-6L1 7"
                    />
                  </svg>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.filter-option {
  @apply flex items-center justify-center cursor-pointer text-sm px-4 py-2 hover:bg-indigo-200;
}
.date-picker {
  --v-calendar-input-font-size: theme("fontSize.sm");
  --v-calendar-day-font-size: theme("fontSize.sm");
  --v-calendar-view-button-font-size: theme("fontSize.base");
  --v-calendar-day-name-font-size: theme("fontSize.sm");
  --v-calendar-input-border: 1px solid theme("colors.gray.400");

  :deep(.v-calendar) {
    input {
      @apply h-8;
    }
    svg {
      @apply h-6 w-4;
    }
  }
}
</style>
