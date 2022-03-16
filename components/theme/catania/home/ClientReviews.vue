<script setup lang="ts">
import { useFormStore } from "~~/store/form";
const homeStyle = computed(() => useFormStore().getHomeStyle);
const reviews = [
  {
    avatar: "https://i.pravatar.cc/100?1",
    name: "GMV",
    time: "a month ago",
    star: 5,
    review:
      "I'm pleased with the service I've been receiving at this time. My case is still in progress and they've been very helpful throughhout this process and has been a blessing during my time of need. Their experience, advice and guidance has helped me immensely. I would definitely recommend Catania and Catania to any one who needs help. Don't hesitate to call them if you're ever in need of representation. Kind Regards, Deloris Brook.",
  },
  {
    avatar: "https://i.pravatar.cc/100?2",
    name: "Christia Marie",
    time: "a month ago",
    star: 5,
    review:
      "Joe Catania worked very hard to get me a fair settlement, and did everything he could to help me attempt to recover from a horrendous accident! I would absolutely recommend him! He always made himself available to me and answered any questions or concerns I had! I pray that I never need his services again, but if so I will definitely be calling him! Thanks, Joe!",
  },
  {
    avatar: "https://i.pravatar.cc/100?3",
    name: "Cooper Groff",
    time: "a month ago",
    star: 5,
    review:
      "MJ was the best to work with! She was able to answered my questions to the best of her ability and always quick with response time even on weekends! Thankyou",
  },
  {
    avatar: "https://i.pravatar.cc/100?4",
    name: "Juan Carlos",
    time: "a month ago",
    star: 5,
    review:
      "I'm pleased with the service I've been receiving at this time. My case is still in progress and they've been very helpful throughhout this process and has been a blessing during my time of need. Their experience, advice and guidance has helped me immensely. I would definitely recommend Catania and Catania to any one who needs help. Don't hesitate to call them if you're ever in need of representation. Kind Regards, Deloris Brook.",
  },
];
</script>

<template>
  <div class="h-max">
    <h2>CLIENT REVIEWS</h2>
    <ul
      class="list-reviews scroller"
      :class="{
        reviewRight: homeStyle === 'reviewRight',
        reviewBottom: homeStyle === 'reviewBottom',
      }"
    >
      <li v-for="item in reviews" :key="item.name" class="review-item">
        <div class="review-header">
          <div class="flex flex-row items-center">
            <div class="avatar">
              <img :src="item.avatar" />
            </div>
            <div class="flex flex-col">
              <span class="name">{{ item.name }}</span>
              <span class="time">{{ item.time }}</span>
            </div>
          </div>
          <div class="star">
            <span v-for="i in item.star" :key="i" class="star-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div class="review">{{ item.review }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
h2 {
  @apply text-lg text-catania-primary font-extrabold text-center;
}
.list-reviews {
  @apply flex gap-4 p-4;

  &.reviewBottom {
    @apply flex-row flex-nowrap overflow-x-auto;
    margin: 0 10%;

    .review-item {
      max-width: 400px;
    }
  }
  &.reviewRight {
    @apply flex-col overflow-y-auto;
    max-height: 550px;
  }
  .review-item {
    @apply flex flex-col items-center bg-white shadow-main rounded-lg py-4 px-6;
  }

  .review-header {
    @apply flex flex-row justify-between w-full;

    .avatar {
      /* @apply flex flex-row items-center; */
      img {
        @apply w-12 h-12 rounded-full object-cover mr-3;
      }
    }
    .name {
      @apply leading-4;
    }
    .time {
      @apply text-xs text-catania-secondary;
    }
    .star {
      @apply flex flex-row items-center gap-2;
      .star-item svg {
        @apply w-6 h-6;

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
