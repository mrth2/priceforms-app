<script setup lang="ts">
import CoreButton from "~/components/core/Button.vue";
import { useFormStore } from "~~/store/form";
import { IFormCategory } from "~~/types/form";

definePageMeta({
  layout: "form",
  title: "Case Type",
});

const formStore = useFormStore();

const form = computed(() => formStore.form);
const categoryForm = computed(() => form.value.categoryForm);
formStore.setProgress({
  label: categoryForm.value.progress,
  value: 10,
});

const categories = computed(() => form.value.categories);

const selectedCategory = ref<IFormCategory>(null);
function selectCategory(category: IFormCategory) {
  if (selectedCategory.value && selectedCategory.value.id === category.id) {
    selectedCategory.value = null;
  } else {
    selectedCategory.value = category;
  }
}
function goNext() {
  
}
</script>

<template>
  <div class="p-6">
    <h1>{{ categoryForm.title }}</h1>

    <div class="categories">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ selected: selectedCategory?.id === category.id }"
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
      <CoreButton type="delete" @click="$router.back()">BACK</CoreButton>
      <CoreButton
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
  @apply !text-4xl text-center !mb-6 !pt-2;
}
.categories {
  @apply flex flex-wrap flex-row justify-center gap-4 pb-6 max-w-xl mx-auto;

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
    &:hover {
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
}
.cta {
  @apply flex justify-center gap-4;
}
</style>
