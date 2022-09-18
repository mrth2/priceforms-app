<script setup lang="ts">
import { useAppStore } from "~~/store/app";
import { useFormStore } from "~~/store/form";
import { useSubmissionStore } from "~~/store/submission";

const router = useRouter();

const formStore = useFormStore();
const form = computed(() => formStore.form);

const zipHint = computed(() => form.value.zip.find((item) => item.hint)?.hint);
const zipCodes = computed(() =>
  form.value.zip.filter((item) => item.code).map((item) => item.code)
);
const zipButton = computed(
  () => form.value.zip.find((item) => item.button)?.button
);

const inputCode = ref("");
const formInput = ref<HTMLElement & { $tippy: any }>();
const termAgreed = ref(true);

const limitDigits = computed(() => form.value.zipRestriction.limitDigits);
// require zip to be valid if zip is configured to be required and has list of zip codes
const requireZipCodeCheck = computed(
  () => zipCodes.value.length > 0 && form.value.zipRestriction.checkCode
);
async function checkZip() {
  if (!termAgreed.value) return;
  // check for number of digits via configured limit
  const pattern = new RegExp(`^(\\d{${limitDigits.value}})$`, "g");
  // if form require digit limitation, check for match
  if (
    form.value.zipRestriction.requireDigit &&
    !pattern.test(inputCode.value)
  ) {
    formInput.value.$tippy.show();
    return;
  }
  // if form require code validation via zip codes, check for match
  if (!requireZipCodeCheck.value || zipCodes.value.includes(inputCode.value)) {
    // save submission to storage with zip code
    const submissionStore = useSubmissionStore();
    submissionStore.setSubmission({
      ...submissionStore.submission,
      zip: inputCode.value,
    });
    router.push("/signup");
  } else {
    useAppStore().pushNotification({
      type: "error",
      title: "Invalid Zip Code",
      position: "center",
    });
  }
}

// if zip input is focused, auto scroll the page to make sure input field is showing on the viewport ( especially if mobile keyboard is open )
const inputFocusing = ref(false);
function autoScrollDownOnMobile() {
  if (inputFocusing.value) {
    document.querySelector(".container").scrollTo({
      top:
        formInput.value.offsetTop +
        formInput.value.parentElement.offsetHeight -
        window.innerHeight,
      behavior: "smooth",
    });
  }
}
onMounted(() => {
  window.addEventListener("resize", autoScrollDownOnMobile);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", autoScrollDownOnMobile);
});
</script>

<template>
  <div class="form-zip">
    <form @submit.prevent="checkZip">
      <img class="red-arrow" src="@/assets/images/arrow.svg" />
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
          @focus="inputFocusing = true"
          @blur="inputFocusing = false"
        />
        <CoreButton
          :is-submit="true"
          class="uppercase"
          :class="{ 'opacity-50': !termAgreed }"
          v-tippy="{
            content: !termAgreed
              ? 'Please agree to the terms and conditions'
              : null,
            trigger: 'mouseenter',
            placement: 'top',
          }"
        >
          {{ zipButton }}
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
.form-zip {
  @apply text-center relative;

  .red-arrow {
    @apply absolute mt-1 -rotate-12;
    @screen xs {
      @apply h-14 -top-8 left-14;
    }
    @screen sm {
      @apply h-20 -top-12 left-20;
    }
    @screen md {
      @apply left-6;
    }
    @screen lg {
      @apply h-36 -top-24 left-6;
    }
  }

  h3 {
    @apply text-catania-primary font-extrabold md:text-lg;
  }

  .form-group {
    @apply mt-4 grid sm:grid-flow-col-dense md:grid-flow-row-dense lg:grid-flow-col-dense gap-4;

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
