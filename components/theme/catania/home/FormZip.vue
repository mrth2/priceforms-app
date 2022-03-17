<script setup lang="ts">
import { useFormStore } from "~~/store/form";

const router = useRouter();

const formStore = useFormStore();
const form = computed(() => formStore.form);

const zipHint = computed(() => form.value.zip.find((item) => item.hint)?.hint);
const zipCodes = computed(() =>
  form.value.zip.filter((item) => item.code).map((item) => item.code)
);

const inputCode = ref("");
const formInput = ref();
const termAgreed = ref(false);

async function checkZip() {
  if (!termAgreed.value) return;
  if (!/^(\d{5})$/g.test(inputCode.value)) {
    formInput.value.$tippy.show();
    return;
  }
  if (zipCodes.value.includes(inputCode.value)) {
    router.push("/signup");
  }
}
</script>

<template>
  <div class="form-register">
    <form>
      <h3>ENTER YOUR ZIP CODE TO BEGIN</h3>
      <div class="form-group">
        <input
          ref="formInput"
          class="form-input"
          v-tippy="{
            content: zipHint,
            placement: 'bottom',
            trigger: 'manual',
            interactive: true,
          }"
          v-model.trim="inputCode"
          type="text"
          placeholder="Enter zip code"
        />
        <CoreButton
          class="uppercase"
          :class="{ 'opacity-50': !termAgreed }"
          v-tippy="{
            content: !termAgreed
              ? 'Please agree to the terms and conditions'
              : null,
            trigger: 'mouseenter',
            placement: 'top',
          }"
          @click="checkZip"
        >
          {{ form.button.joining }}
        </CoreButton>
      </div>
      <div class="agreement">
        <input v-model="termAgreed" type="checkbox" />
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

    :deep(.tippy-box) {
      @apply bg-red-600;

      .tippy-arrow {
        @apply text-red-600;
      }
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
