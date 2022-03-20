<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/outline";
import { useAppStore } from "~~/store/app";
import { IFormCategory, IFormSubmission } from "~~/types/form";
import { ISubscriber } from "~~/types/subscriber";
import { useSubmissionStore } from "~~/store/submission";
import Button from "~~/components/core/Button.vue";
import SubmissionDetail from "~~/components/admin/submissions/SubmissionDetail.vue";

definePageMeta({
  layout: "admin",
  title: "Submission",
  middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const graphql = useStrapiGraphQL();
const appStore = useAppStore();
appStore.setLoading(true);
const { pending, data } = useAsyncData<{ data: any }>("submission", () =>
  graphql(`
    query SUBMISSION {
      formSubmission(id: ${route.params.id}) {
        data {
          id
          attributes {
            zip
            category {
              data {
                attributes{
                  title
                }
              }
            }
            subscriber {
              data {
                attributes {
                  firstName
                  lastName
                  email
                }
              }
            }
            status
            stopAt
            progress
            minPrice
            maxPrice
            currency
            data
            dataPath {
              id
              flow {
                data {
                  attributes{
                    name
                  }
                }
              }
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  `)
);
watch(pending, () => {
  if (!pending.value && !submission.value) {
    return router.push("/admin/submissions");
  }
  appStore.setLoading(pending.value);
});

const nuxtApp = useNuxtApp();
const submission = computed<IFormSubmission>(() =>
  pending.value ? null : nuxtApp.$strapiParser(data.value, "formSubmission")
);
// reorder data by question order ASC
const submissionData = computed(() =>
  submission.value?.data.sort((a, b) => a.order - b.order)
);
const category = computed<IFormCategory>(() =>
  pending.value || !submission.value
    ? null
    : nuxtApp.$strapiParser(submission.value.category, "category")
);
const subscriber = computed<ISubscriber>(() =>
  pending.value || !submission.value
    ? null
    : nuxtApp.$strapiParser(submission.value?.subscriber, "subscriber")
);

const deletingSubmission = ref<IFormSubmission | null>(null);
async function deleteSubmission() {
  if (!deletingSubmission.value) return;
  try {
    await useSubmissionStore().deleteSubmission(deletingSubmission.value.id);
    appStore.pushNotification({
      type: "success",
      title: "Submission deleted!",
    });
    router.push("/admin/submissions");
  } catch (e) {
    appStore.pushNotification({
      type: "error",
      title: "Can not delete submission:",
      message: e.message,
    });
  }
}
</script>
<template>
  <div v-if="!pending && submission" class="mx-auto xl:grid xl:grid-cols-3">
    <div class="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
      <div>
        <div>
          <div
            class="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6"
          >
            <div>
              <p class="mt-2 text-sm text-gray-500">
                #{{ submission.id }} submitted by
                {{ " " }}
                <a href="#" class="font-medium text-gray-900">
                  {{ $fullname(subscriber) }}
                </a>
                {{ " " }}
                in
                {{ " " }}
                <a href="#" class="font-medium text-gray-900">
                  {{ category.title }}
                </a>
              </p>
            </div>
            <div class="mt-4 flex space-x-3 md:mt-0">
              <Button
                type="delete"
                :icon="TrashIcon"
                @click="deletingSubmission = submission"
              >
                Delete
              </Button>
            </div>
          </div>
          <SubmissionDetail :submission="submission" class="mt-8 xl:hidden" />
        </div>
      </div>
      <section aria-labelledby="activity-title">
        <div class="pt-2">
          <!-- Question answered -->
          <div class="flow-root">
            <ul
              v-if="submissionData && submissionData?.length"
              role="list"
              class="divide-y divide-gray-200"
            >
              <li v-for="item in submissionData" :key="item.qid" class="py-4">
                <div class="flex space-x-3">
                  <div class="flex-1 space-y-1">
                    <div class="flex items-center justify-between">
                      <h3 class="text-sm font-medium">
                        {{ item.question }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{ $dateFormat(item.at) }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-500">
                      {{ item.answer }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div v-else class="pt-6">
              {{ $fullname(subscriber) }} did not answered any question. Please
              wait him/her for a while.
            </div>
          </div>
        </div>
      </section>
    </div>
    <SubmissionDetail
      :submission="submission"
      class="hidden xl:block xl:pl-8"
    />

    <!-- confirm delete -->
    <CoreConfirmModal
      v-if="!!deletingSubmission"
      :open="true"
      :title="`Delete submission #${deletingSubmission.id} from ${$fullname(
        subscriber
      )}?`"
      :description="`Are you sure you want to delete this submission? It will be permanently removed from our servers forever. This action cannot be undone!`"
      :confirm-text="`OK. Delete now!`"
      @cancel="deletingSubmission = null"
      @confirm="deleteSubmission"
    />
  </div>
</template>
