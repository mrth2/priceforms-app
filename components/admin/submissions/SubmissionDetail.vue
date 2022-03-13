<script setup lang="ts">
import { IFormSubmission } from "~~/types/form";
import {
  UserCircleIcon as UserCircleIconSolid,
  ClockIcon,
  BadgeCheckIcon,
  QuestionMarkCircleIcon,
  CalendarIcon,
  LocationMarkerIcon,
  CurrencyDollarIcon,
  CurrencyPoundIcon,
  CurrencyEuroIcon,
  CalculatorIcon,
  StopIcon,
} from "@heroicons/vue/solid";

const props = defineProps<{
  submission: IFormSubmission;
}>();
const submissionStatusIcon = computed(() => {
  if (props.submission) {
    switch (props.submission.status) {
      case "register":
        return UserCircleIconSolid;
      case "partial":
        return ClockIcon;
      case "complete":
        return BadgeCheckIcon;
    }
  }
  return null;
});
const currencyIcon = computed(() => {
  switch (props.submission.currency) {
    case "usd":
      return CurrencyDollarIcon;
    case "gbp":
      return CurrencyPoundIcon;
    case "eur":
      return CurrencyEuroIcon;
  }
});
const iconClass = computed(() =>
  useNuxtApp().$getStatusClass(props.submission.status)
);
</script>
<template>
  <aside v-if="submission">
    <h2 class="sr-only">Details</h2>
    <div class="details">
      <div class="detail-item">
        <Component
          :is="submissionStatusIcon"
          class="h-5 w-5"
          :class="iconClass"
          aria-hidden="true"
        />
        <span
          class="text-sm font-medium capitalize !bg-transparent"
          :class="iconClass"
        >
          {{ submission.status }}
        </span>
      </div>
      <div class="detail-item">
        <QuestionMarkCircleIcon
          class="detail-item-icon"
          :class="iconClass"
          aria-hidden="true"
        />
        <span class="detail-item-text">
          {{ submission.data?.length || 0 }} questions answered
        </span>
      </div>
      <div class="detail-item">
        <CalendarIcon
          class="detail-item-icon"
          :class="iconClass"
          aria-hidden="true"
        />
        <span class="detail-item-text">
          Submitted on
          <time :datetime="new Date(submission.createdAt).toLocaleDateString()">
            {{ $dateFormat(submission.createdAt) }}
          </time>
        </span>
      </div>
      <div class="detail-item">
        <LocationMarkerIcon class="detail-item-icon" :class="iconClass" />
        <span class="detail-item-text">Zip: {{ submission.zip }}</span>
      </div>
      <div class="detail-item">
        <Component
          :is="currencyIcon"
          class="detail-item-icon"
          :class="iconClass"
        />
        <span class="detail-item-text">
          Price:
          {{
            `${$getCurrencySymbol(submission.currency)}${submission.minPrice}`
          }}
          ~
          {{
            `${$getCurrencySymbol(submission.currency)}${submission.maxPrice}`
          }}
        </span>
      </div>
      <div class="detail-item">
        <CalculatorIcon class="detail-item-icon" :class="iconClass" />
        <span class="detail-item-text">Progress: {{ submission.progress }}%</span>
      </div>
      <div class="detail-item">
        <StopIcon class="detail-item-icon" :class="iconClass" />
        <span class="detail-item-text">Stop at: {{ submission.stopAt }}</span>
      </div>
    </div>
  </aside>
</template>
<style scoped lang="postcss">
.details {
  @apply space-y-5;

  .detail-item {
    @apply flex items-center space-x-2;

    .detail-item-icon {
      @apply h-5 w-5;
    }
    .detail-item-text {
      @apply text-gray-900 text-sm font-medium;
    }
  }
}
</style>
