<script setup lang="ts">
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import startCase from "lodash/startCase";
import {
  ArrowNarrowDownIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/vue/outline";
import { Strapi4RequestParams } from "@nuxtjs/strapi/dist/runtime/types";
import SubmissionsFilter from "~~/components/admin/submissions/SubmissionsFilter.vue";
import { useAppStore } from "~~/store/app";
import { useSubmissionStore } from "~~/store/submission";
definePageMeta({
  layout: "admin",
  title: "Submissions",
  description: "View submissions from your form!",
});

const { $dateFormat } = useNuxtApp();

const strapi = useStrapi4();

const filters = reactive({
  status: ["register", "partial", "complete"] as Array<
    "register" | "partial" | "complete"
  >,
  dates: [],
  limit: 10,
  page: 1,
});
const appStore = useAppStore();
const loading = computed(() => appStore.isLoading);
async function fetchData() {
  appStore.setLoading(true);
  const params = {
    fields: [
      "zip",
      "status",
      "progress",
      "stopAt",
      "minPrice",
      "maxPrice",
      "currency",
      "data",
      "createdAt",
      "updatedAt",
    ],
    filters: {
      status: {
        $in: filters.status.length ? filters.status : [],
      },
    },
    populate: ["form", "category", "subscriber"],
    pagination: {
      page: filters.page,
      pageSize: filters.limit,
    },
  } as Strapi4RequestParams;
  if (filters.dates.length === 2) {
    params.filters.createdAt = {
      $gte: filters.dates[0],
      $lte: filters.dates[1],
    };
  }
  const result = await strapi.find<{ data: any; meta: any }>(
    "form-submissions",
    params
  );
  appStore.setLoading(false);
  return result;
}

const { data } = await useAsyncData("form-submissions", fetchData);
watch(
  filters,
  async () => {
    data.value = await fetchData();
  },
  { deep: true }
);

const sortAsc = ref(true);
type SortField = "updated" | "status" | "name" | "progress";
const sortBy = ref<SortField>("updated");
function sortClasses(type: SortField) {
  return {
    "transform -rotate-180": sortAsc.value,
    current: sortBy.value === type,
  };
}

const submissions = computed(() => {
  if (!data.value) return [];
  try {
    return data.value.data
      .map((s) => ({
        id: s.id,
        ...s.attributes,
        category: {
          id: s.attributes.category?.data?.id,
          ...s.attributes.category?.data?.attributes,
        },
        form: {
          id: s.attributes.form?.data?.id,
          ...s.attributes.form?.data?.attributes,
        },
        subscriber: {
          id: s.attributes.subscriber?.data?.id,
          ...s.attributes.subscriber?.data?.attributes,
          fullName: useNuxtApp().$fullname(s.attributes.subscriber?.data?.attributes),
        },
      }))
      .sort((a, b) => {
        // sort by updatedAt
        if (sortBy.value === "updated") {
          if (sortAsc.value) {
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          } else {
            return (
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            );
          }
        }
        // sort by status name
        if (sortBy.value === "status") {
          if (sortAsc.value) {
            return a.status.localeCompare(b.status);
          } else {
            return b.status.localeCompare(a.status);
          }
        }
        // sort by progress
        if (sortBy.value === "progress") {
          if (sortAsc.value) {
            return b.progress - a.progress;
          } else {
            return a.progress - b.progress;
          }
        }
        // sort by user name
        if (sortAsc.value) {
          return a.subscriber.fullName.localeCompare(b.subscriber.fullName);
        } else {
          return b.subscriber.fullName.localeCompare(a.subscriber.fullName);
        }
      });
  } catch (e) {
    console.error(e);
    return [];
  }
});

const pagination = computed<{
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}>(() => data.value?.meta?.pagination);
const pages = computed(() => {
  if (!pagination.value) return [];
  let { page: current, pageCount: count } = pagination.value;
  return generatePagination(current, count);
});

function generatePagination(c: number, m: number) {
  var current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l: number;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

function exportCSV<T>(
  data: Array<T>,
  headers: string[],
  fileName: string
): void {
  const rows = [...[headers], ...data.map((kw) => Object.values(kw))];
  const csvContent =
    "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
  const encodeUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodeUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function getExportRow(submission, index) {
  return {
    index: index + 1,
    zip: submission.zip,
    name: submission.subscriber.fullName,
    email: submission.subscriber.email,
    phone: submission.subscriber.phone,
    status: startCase(submission.status),
    createdAt: $dateFormat(submission.createdAt, false, true),
    category: submission.category.title,
  };
}

function exportSubmissions(type: "csv" | "pdf") {
  const headers = [
    "No.",
    "Zip",
    "Name",
    "Email",
    "Phone",
    "Status",
    "Created",
    "Case Type",
  ];
  if (type === "csv") {
    const table = [];
    submissions.value.forEach((submission, index) => {
      const row = getExportRow(submission, index);
      if (submission.data && submission.data.length) {
        const row2 = Object.keys(row).reduce(
          (acc, key) => ({ ...acc, [key]: "" }),
          {}
        );
        submission.data.forEach((d) => {
          row[`q${d.qid}`] = "Q: " + d.question;
          row2[`a${d.qid}`] = "A: " + d.answer;
        });
        table.push(row);
        table.push(row2);
      } else {
        table.push(row);
      }
    });
    return exportCSV(table, headers, "submissions");
  } else {
    const table = submissions.value.map(getExportRow);
    const rows = table.map((kw) => Object.values(kw));

    const doc = new jsPDF({
      orientation: "landscape",
    });
    autoTable(doc, {
      head: [headers],
      body: rows,
      theme: "grid",
    });
    doc.save("submissions.pdf");
  }
}

const deletingSubmission = ref(null);
async function deleteSubmission() {
  try {
    await useSubmissionStore().deleteSubmission(deletingSubmission.value.id);
    appStore.pushNotification({
      type: "success",
      title: "Submission deleted",
    });
    data.value = await fetchData();
    deletingSubmission.value = null;
  } catch (e) {
    console.dir(e);
    appStore.pushNotification({
      type: "error",
      title: "Can not delete submission:",
      message: e.message,
    });
  }
}
</script>

<template>
  <div class="flex flex-col">
    <SubmissionsFilter
      :status="filters.status"
      @change-status="filters.status = $event"
      :limit="filters.limit"
      @change-limit="filters.limit = $event"
      @change-date="filters.dates = $event"
      @export="exportSubmissions($event)"
    />
    <div class="scroller scroller--sm -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border border-gray-200 sm:rounded-lg"
        >
          <table
            v-if="!loading"
            class="min-w-full divide-y divide-gray-200 border-gray-400"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="heading sortable"
                  @click="
                    () => {
                      sortAsc = !sortAsc;
                      sortBy = 'name';
                    }
                  "
                >
                  Name
                  <ArrowNarrowDownIcon
                    class="sort-icon"
                    :class="sortClasses('name')"
                  />
                </th>
                <th scope="col" class="heading">Form</th>
                <th scope="col" class="heading">Zip Code</th>
                <th
                  scope="col"
                  class="heading sortable"
                  @click="
                    () => {
                      sortAsc = !sortAsc;
                      sortBy = 'status';
                    }
                  "
                >
                  Status
                  <ArrowNarrowDownIcon
                    class="sort-icon"
                    :class="sortClasses('status')"
                  />
                </th>
                <th scope="col" class="heading">Price</th>
                <th
                  scope="col"
                  class="heading sortable"
                  @click="
                    () => {
                      sortAsc = !sortAsc;
                      sortBy = 'progress';
                    }
                  "
                >
                  Progress
                  <ArrowNarrowDownIcon
                    class="sort-icon"
                    :class="sortClasses('progress')"
                  />
                </th>
                <th scope="col" class="heading">Stoped At</th>
                <th
                  scope="col"
                  class="heading sortable"
                  @click="
                    () => {
                      sortAsc = !sortAsc;
                      sortBy = 'updated';
                    }
                  "
                >
                  Last Updated
                  <ArrowNarrowDownIcon
                    class="sort-icon"
                    :class="sortClasses('updated')"
                  />
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <!-- show content -->
            <tbody
              v-if="submissions.length"
              class="bg-white divide-y divide-gray-200"
            >
              <tr v-for="item in submissions" :key="item.id">
                <td class="row">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <CoreAvatar
                        :class="$getStatusClass(item.status, false)"
                        :name="item.subscriber.fullName"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ item.subscriber.fullName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ item.subscriber.email }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="row">
                  <div class="text-sm text-gray-900 uppercase">
                    {{ item.form.subDomain }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Case: {{ item.category.title }}
                  </div>
                </td>
                <td class="row">
                  {{ item.zip }}
                </td>
                <td class="row">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                    :class="$getStatusClass(item.status, false)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="row text-sm">
                  {{ item.minPrice }} ~ {{ item.maxPrice }} ({{
                    item.currency
                  }})
                </td>
                <td class="row">{{ item.progress }}%</td>
                <td class="row !text-xs !whitespace-normal w-16 capitalize">
                  {{ item.stopAt.toLowerCase() || "Just signed up" }}
                </td>
                <td class="row">
                  {{ $dateFormat(item.updatedAt) }}
                </td>
                <td class="row actions">
                  <NuxtLink
                    :to="`/admin/submissions/${item.id}`"
                    class="action__item text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </NuxtLink>
                  |
                  <a
                    class="action__item text-red-600 hover:text-red-900"
                    @click="deletingSubmission = item"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            </tbody>
            <!-- no content -->
            <tbody v-else>
              <tr>
                <td colspan="8" class="text-center py-8">
                  <div class="text-gray-500">No submissions found.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <nav v-if="submissions.length" class="page-nav">
      <div class="-mt-px w-0 flex-1 flex">
        <a
          href="#"
          class="border-t-2 border-transparent pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          :class="{ 'opacity-50': filters.page <= 1 }"
          @click="filters.page > 1 && (filters.page = filters.page - 1)"
        >
          <ArrowNarrowLeftIcon
            class="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Previous
        </a>
      </div>
      <div
        class="hidden md:-mt-px md:flex max-w-md overflow-x-auto scroller scroller--sm"
      >
        <template v-for="item in pages" :key="item">
          <a
            href="#"
            class="page"
            :class="{ active: item === filters.page }"
            @click="!isNaN(parseInt(item)) && (filters.page = item)"
          >
            {{ item }}
          </a>
        </template>
      </div>
      <div class="-mt-px w-0 flex-1 flex justify-end">
        <a
          href="#"
          class="border-t-2 border-transparent pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          :class="{ 'opacity-50': filters.page >= pagination.pageCount }"
          @click="
            filters.page < pagination.pageCount &&
              (filters.page = filters.page + 1)
          "
        >
          Next
          <ArrowNarrowRightIcon
            class="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </a>
      </div>
    </nav>

    <!-- confirm delete -->
    <CoreConfirmModal
      v-if="!!deletingSubmission"
      :open="true"
      :title="`Delete submission from ${deletingSubmission.subscriber.fullName}`"
      :description="`Are you sure you want to delete this submission? It will be permanently removed from our servers forever. This action cannot be undone!`"
      :confirm-text="`OK. Delete now!`"
      @cancel="deletingSubmission = null"
      @confirm="deleteSubmission"
    />
  </div>
</template>

<style scoped lang="postcss">
.heading {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-max whitespace-nowrap;

  &.sortable {
    @apply flex flex-row gap-1.5 cursor-pointer;
  }

  .sort-icon {
    @apply w-4 h-4 opacity-0;
    &.current {
      @apply opacity-100 !important;
    }
  }
  &:hover {
    .sort-icon {
      @apply opacity-100;
    }
  }
}
.row {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500;

  &.actions {
    @apply text-right text-sm font-medium;

    .action__item {
      @apply cursor-pointer;
    }
  }
}
.page-nav {
  @apply mt-4 border-t border-gray-200 px-4 flex items-center justify-between sm:px-0;

  .page {
    @apply border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 px-4 py-2 inline-flex items-center text-sm font-medium;

    &.active {
      @apply border-indigo-500 text-indigo-600 bg-indigo-200;
    }
  }
}
</style>
