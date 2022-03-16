<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const formStore = useFormStore();
const form = computed(() => formStore.form);

const zipHint = computed(() => form.value.zip.find((item) => item.hint)?.hint);

const inputCode = ref("");

async function checkZip() {}
</script>

<template>
  <div class="form-register">
    <form>
      <h3>ENTER YOUR ZIP CODE TO BEGIN</h3>
      <div class="form-group">
        <div class="form-input">
          <input
            v-model.trim="inputCode"
            type="text"
            placeholder="Enter zip code"
          />
        </div>
        <CoreButton class="uppercase">
          {{ form.button.joining }}
        </CoreButton>
      </div>
      <div class="agreement">
        <input type="checkbox" />
        <span>{{ form.term }}</span>
      </div>
    </form>
  </div>
</template>

<style scoped lang="postcss">
.form-register {
  @apply pl-4 text-center;

  h3 {
    @apply text-catania-primary font-extrabold text-lg;
  }

  .form-group {
    @apply mt-4 grid grid-cols-2 gap-4;

    input {
      @apply w-full border border-catania-outline rounded flex items-center h-10 indent-2 focus:outline-catania-button;
    }
  }
  .agreement {
    @apply mt-4 relative;

    input[type="checkbox"] {
      @apply h-5 w-5 border-catania-outline absolute top-1 left-0;
    }

    span {
      @apply text-[11px] text-justify block leading-4 text-catania-secondary ml-7;
    }
  }
}
</style>
