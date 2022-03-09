<script setup lang="ts">
definePageMeta({
  layout: "admin",
  title: "Submissions",
});
const { find } = useStrapi4();

const { data } = await useAsyncData("form-submissions", () =>
  find<{ data: any }>("form-submissions", {
    fields: [
      "status",
      "progress",
      "stopAt",
      "minPrice",
      "maxPrice",
      "currency",
      "createdAt",
      "updatedAt",
    ],
    populate: ["form", "category", "user"],
  })
);
const submissions = computed(() =>
  data.value.data.map((s) => ({
    id: s.id,
    ...s.attributes,
    category: {
      id: s.attributes.category.data.id,
      ...s.attributes.category.data.attributes,
    },
    form: {
      id: s.attributes.form.data.id,
      ...s.attributes.form.data.attributes,
    },
    user: {
      id: s.attributes.user.data.id,
      ...s.attributes.user.data.attributes,
    },
  }))
);

function getStatusClass(item) {
  return {
    "bg-cyan-100 text-cyan-800": item.status === "register",
    "bg-blue-100 text-blue-800": item.status === "partial",
    "bg-green-100 text-green-800": item.status === "complete",
  };
}
</script>

<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="heading">Name</th>
                <th scope="col" class="heading">Form</th>
                <th scope="col" class="heading">Status</th>
                <th scope="col" class="heading">Progress</th>
                <th scope="col" class="heading">Stoped At</th>
                <th scope="col" class="heading">Price</th>
                <th scope="col" class="heading">Last Updated</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in submissions" :key="item.id">
                <td class="row">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center font-medium tracking-tight"
                        :class="getStatusClass(item)"
                        alt="user"
                      >
                        {{ item.user.firstName.charAt(0) }}
                        {{ item.user.lastName.charAt(0) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ item.user.firstName }}
                        {{ item.user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ item.user.email }}
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
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize"
                    :class="getStatusClass(item)"
                  >
                    {{ item.status }}
                  </span>
                </td>
                <td class="row">{{ item.progress }}%</td>
                <td class="row !text-[10px] !whitespace-normal w-16 capitalize">
                  {{ item.stopAt.toLowerCase() || "Just signed up" }}
                </td>
                <td class="row text-sm">
                  {{ item.minPrice }} ~ {{ item.maxPrice }} ({{
                    item.currency
                  }})
                </td>
                <td class="row">
                  {{ $dateFormat(item.updatedAt) }}
                </td>
                <td class="row text-right text-sm font-medium">
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.heading {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-max whitespace-nowrap;
}
.row {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500;
}
</style>
