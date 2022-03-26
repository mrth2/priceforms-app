<script setup lang="ts">
import CoreButton from "~/components/core/Button.vue";
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";
import { IFormCategory } from "~~/types/form";
import { useGtag } from "vue-gtag-next";

definePageMeta({
  layout: "form",
  title: "Case Type",
});

const router = useRouter();

const formStore = useFormStore();
const submissionStore = useSubmissionStore();

const form = computed(() => formStore.form);
const categoryForm = computed(() => form.value.categoryForm);
const submission = computed(() => submissionStore.submission);
// if submission has no saved zip or subscriber, go back to home
if (!submission.value?.zip || !submission.value?.subscriber) {
  router.push("/");
}

useAppStore().setCurrentProgress({
  label: categoryForm.value.progress,
  value: 10,
});

const categories = computed(() => form.value.categories);

const selectedCategory = ref<IFormCategory>(submission.value?.category);
function selectCategory(category: IFormCategory) {
  // allow unselecting category if hasNext button
  if (
    categoryForm.value.hasNext &&
    selectedCategory.value &&
    selectedCategory.value.id === category.id
  ) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = category;
  }
  // auto go next
  if (!categoryForm.value.hasNext) {
    goNext();
  }
}

const { event: gtagEvent } = useGtag();
async function goNext() {
  if (!selectedCategory.value) return;
  // set main category
  submissionStore.setMainCategory(selectedCategory.value);
  // set main category to category list ( submission can belong to multiple categories )
  submissionStore.setCategories([selectedCategory.value]);
  submissionStore.saveSubmission();
  // set event select case
  gtagEvent("select_case", {
    case_id: selectedCategory.value.id,
    case_title: selectedCategory.value.title,
  });
  // go to next page
  const firstQuestion = formStore.getStartQuestion(selectedCategory.value.id);
  if (firstQuestion) {
    router.push(`/question/${firstQuestion.id}`);
  }
}
</script>

<template>
  <div class="py-4 lg:p-6">
    <h1>{{ categoryForm.title }}</h1>

    <div class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{
          selected: selectedCategory?.id === category.id,
          disabled: !category.flows.length,
        }"
        @click="selectCategory(category)"
      >
        <div class="category-item-image">
          <img class="icon" :src="category.icon.url" />
          <img class="icon-active" :src="category.iconActive.url" />
        </div>
        <div class="category-item-title">
          <h2>{{ category.title }}</h2>
        </div>
      </div>
    </div>
    <div class="cta">
      <CoreButton type="delete" @click="$router.push('/signup')">
        BACK
      </CoreButton>
      <CoreButton
        v-if="categoryForm.hasNext"
        :type="selectedCategory ? 'primary' : 'secondary'"
        @click="goNext"
      >
        NEXT
      </CoreButton>
    </div>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply !text-lg md:!text-2xl lg:!text-4xl text-center md:!mb-6 !pt-2;
}
.categories {
  @apply flex flex-wrap flex-row justify-center gap-2 md:gap-4 pb-4 md:pb-6 max-w-xl mx-auto;

  .category-item {
    @apply flex flex-col items-center justify-center gap-1 w-32 h-36 bg-gray-200 cursor-pointer p-4 transition-colors;

    .category-item-image {
      .icon,
      .icon-active {
        @apply h-16 max-w-[64px] object-contain;
      }
      .icon-active {
        @apply hidden;
      }
    }
    .category-item-title {
      @apply text-center text-sm leading-4 h-6;
    }
    &.selected,
    &:hover,
    &:active {
      &:not(.disabled) {
        @apply bg-catania-primary;
        .icon-active {
          @apply block;
        }
        .icon {
          @apply hidden;
        }
        .category-item-title {
          @apply text-white;
        }
      }
    }
    &.disabled {
      @apply cursor-not-allowed opacity-30;
    }
  }
}
.cta {
  @apply flex justify-center gap-4;
}
</style>
