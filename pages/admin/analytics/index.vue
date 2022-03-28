<script setup lang="ts">
import { IFormCategory, IFormSubmission } from "~~/types/form";

definePageMeta({
  layout: "admin",
  title: "Analytics",
  middleware: "auth",
});

const client = useStrapiClient();
const total = reactive({
  partial: 0,
  complete: 0,
  register: 0,
});
const subDomain = useSubDomain();
async function fetchTotalByStatus(status: IFormSubmission["status"]) {
  const { meta } = await client("form-submissions", {
    params: {
      filters: {
        form: {
          subDomain: {
            $eq: subDomain,
          },
        },
        status: {
          $eq: status,
        },
      },
      pagination: {
        pageSize: 1,
      },
    },
  });
  total[status] = meta.pagination.total;
}

type FormCategoryWithCount = IFormCategory & {
  count: number;
};
const categories = ref<FormCategoryWithCount[]>([]);
async function fetchMostPopularCases() {
  try {
    const data = await client<{
      categories: FormCategoryWithCount[];
    }>("form-categories/popular");
    categories.value = data.categories;
  } catch (e) {
    console.error(e);
  }
}
await Promise.all([
  fetchTotalByStatus("complete"),
  fetchTotalByStatus("partial"),
  fetchTotalByStatus("register"),
  fetchMostPopularCases(),
]);
</script>

<template>
  <div>
    <div class="submissions">
      <h2>Submission Count</h2>

      <div class="submission-summary">
        <div class="summary-item" :class="$getStatusClass('register', false)">
          <span class="status">Register</span>
          <span class="total">{{ total.register }}</span>
        </div>
        <div class="summary-item" :class="$getStatusClass('partial', false)">
          <span class="status">Partial</span>
          <span class="total">{{ total.partial }}</span>
        </div>
        <div class="summary-item" :class="$getStatusClass('complete', false)">
          <span class="status">Complete</span>
          <span class="total">{{ total.complete }}</span>
        </div>
      </div>
    </div>
    <div class="cases">
      <h2>Most popular cases</h2>

      <table>
        <thead>
          <tr>
            <th>Case</th>
            <th>Thumbnail</th>
            <th>Submission Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.title }}</td>
            <td><img :src="category.icon.url" /></td>
            <td>{{ category.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="postcss">
h2 {
  @apply text-lg font-bold text-catania-primary mb-4;
}
.submissions {
  .submission-summary {
    @apply max-w-2xl rounded-lg shadow-main;
    @apply grid grid-rows-3 md:grid-rows-none md:grid-cols-3 md:divide-x divide-catania-secondary;

    .summary-item {
      @apply flex flex-row justify-between items-center py-4 px-5;

      .status {
        @apply font-semibold;
      }
      .total {
        @apply text-lg font-bold;
      }
    }
  }
}
.cases {
  @apply mt-6 max-w-2xl;

  table {
    @apply min-w-full border border-catania-secondary;

    thead {
      @apply bg-catania-primary text-white text-left;
      tr {
        @apply divide-x divide-white;
      }
      th {
        @apply pl-2 py-2;

        &:last-child {
          @apply text-right pr-2;
        }
      }
    }
    tbody {
      @apply divide-y divide-catania-secondary;
      tr {
        @apply divide-x divide-catania-secondary;
      }
      td {
        @apply pl-2 py-2;

        img {
          @apply m-auto;
        }

        &:last-child {
          @apply text-right pr-2 font-bold text-lg;
        }
      }
    }
  }
}
</style>
