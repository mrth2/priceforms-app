<script setup lang="ts">
import { useFormStore } from "~~/store/form";
const formStore = useFormStore();
const homeStyle = computed(() => formStore.getHomeStyle);
const reviews = computed(() => formStore.form.reviews);
</script>

<template>
  <div class="h-max" :class="{ 'pt-3 md:pt-5': homeStyle === 'reviewBottom' }">
    <h2>CLIENT REVIEWS</h2>
    <ul
      class="list-reviews scroller"
      :class="{
        reviewRight: homeStyle === 'reviewRight',
        reviewBottom: homeStyle === 'reviewBottom',
        'scroller--sm': homeStyle === 'reviewBottom',
      }"
    >
      <li v-for="item in reviews" :key="item.name" class="review-item">
        <div class="review-header">
          <div class="flex flex-row items-center">
            <div class="avatar">
              <img :src="item.avatar.url" />
            </div>
            <div class="flex flex-col">
              <span class="name">{{ item.name }}</span>
              <span class="time">{{ $dateFormat(item.at) }}</span>
            </div>
          </div>
          <div class="star">
            <span v-for="i in item.rating" :key="i" class="star-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div class="review">{{ item.message }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
h2 {
  @apply md:text-lg text-catania-primary font-extrabold text-center;
}
.list-reviews {
  @apply flex gap-4 py-4 px-1 md:px-4;

  &.reviewBottom {
    @apply flex-row flex-nowrap overflow-x-auto scroll-smooth;

    @apply mx-2;
    @screen md {
      margin: 0 10%;
    }

    .review-item {
      /* min-width: 400px; */
      min-width: 100%;

      @screen sm {
        min-width: 400px;
      }

      @screen md {
        min-width: 70%;
      }

      @screen lg {
        min-width: calc(50% - 8px);
      }
    }
  }
  &.reviewRight {
    @apply flex-col overflow-y-auto scroll-smooth;
    max-height: 450px;

    .review-header {
      @apply flex flex-col gap-2;

      @screen xs {
        @apply flex-row gap-0;
      }
    }
  }
  .review-item {
    @apply flex flex-col items-center bg-white shadow border border-gray-100 rounded-lg py-4 px-6;
  }

  .review-header {
    @apply flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between w-full;

    .avatar {
      /* @apply flex flex-row items-center; */
      img {
        @apply min-w-max w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3;
      }
    }
    .name {
      @apply leading-4 text-sm md:text-base;
    }
    .time {
      @apply text-xs text-catania-secondary;
    }
    .star {
      @apply flex flex-row items-center gap-1 md:gap-2;
      .star-item svg {
        @apply w-5 h-5 md:w-6 md:h-6;

        path {
          @apply fill-yellow-300;
        }
      }
    }
  }
  .review {
    @apply text-xs leading-4 text-catania-secondary text-justify mt-2;
  }
}
</style>
