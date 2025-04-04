<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { useAppStore } from "~~/store/app";

const props = defineProps<{
  selected: Date[] | null;
}>();
const emit = defineEmits(["selected"]);

const selectedDate = reactive<{
  day: number;
  month: string;
  year: number;
}>({
  day: null,
  month: null,
  year: null,
});
function initialSelectedDate() {
  if (
    props.selected &&
    props.selected.length &&
    props.selected[0] instanceof Date
  ) {
    selectedDate.month = props.selected[0].toLocaleString("default", {
      month: "short",
    });
    selectedDate.year = props.selected[0].getFullYear();
    selectedDate.day = props.selected[0].getDate();
  }
}
initialSelectedDate();
watch(() => props.selected, initialSelectedDate);

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const now = new Date();
const years = [...Array(200).keys()]
  .map((i) => i + 1900)
  .filter((y) => y <= now.getFullYear())
  .sort((a, b) => b - a);

function getMonth() {
  return months.findIndex(
    (m) => selectedDate.month && m === selectedDate.month
  );
}
const days = computed(() => {
  const month = getMonth();
  const year = selectedDate.year || now.getFullYear();
  if (month !== -1) {
    const daysInMonth = new Date(+year, +month + 1, 0).getDate();
    return [...Array(daysInMonth).keys()].map((d) => d + 1);
  }
  return [...Array(31).keys()].map((d) => d + 1);
});
function submitDate() {
  const month = getMonth();
  if (month === -1 || !selectedDate.day || !selectedDate.year) {
    useAppStore().pushNotification({
      type: "warning",
      title: "Please select a specific day first",
      position: "center",
    });
    return;
  }
  emit("selected", new Date(selectedDate.year, month, selectedDate.day));
}
</script>

<template>
  <div class="options">
    <div class="option-item">
      <select v-model="selectedDate.month">
        <option :value="null">Month</option>
        <option v-for="m in months" :key="m">{{ m }}</option>
      </select>
      <ChevronDownIcon class="arrow" />
    </div>
    <div class="option-item">
      <select v-model="selectedDate.day">
        <option :value="null">Day</option>
        <option v-for="d in days" :key="d">{{ d }}</option>
      </select>
      <ChevronDownIcon class="arrow" />
    </div>
    <div class="option-item">
      <select v-model="selectedDate.year">
        <option :value="null">Year</option>
        <option v-for="y in years" :key="y">{{ y }}</option>
      </select>
      <ChevronDownIcon class="arrow" />
    </div>
    <CoreButton class="!text-white !px-4 !text-lg !h-12" @click="submitDate">
      SUBMIT
    </CoreButton>
  </div>
</template>

<style scoped lang="postcss">
.options {
  @apply flex flex-col sm:flex-row items-center gap-4;

  .option-item {
    @apply relative;
  }

  select {
    @apply border-2 border-gray-300 rounded w-[120px] pl-5 py-2 appearance-none text-catania-primary text-lg font-bold cursor-pointer;
  }

  .arrow {
    @apply absolute top-3.5 right-2 w-6 h-6 text-gray-400;
  }
}
</style>
