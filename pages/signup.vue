<script setup lang="ts">
import { XIcon } from "@heroicons/vue/solid";
import { useFormStore } from "~~/store/form";
import CoreButton from "~~/components/core/Button.vue";
import { ISubscriber } from "~~/types/subscriber";
import { useSubmissionStore } from "~~/store/submission";
import { useAppStore } from "~~/store/app";
import { useGtag, isReady } from "vue-gtag-next";

definePageMeta({
  layout: "form",
  title: "Sign Up",
});

const router = useRouter();

const formStore = useFormStore();
const form = computed(() => formStore.form);
const registerForm = computed(() => form.value.registerForm);

const submissionStore = useSubmissionStore();
const submission = computed(() => submissionStore.submission);
// if submission has no saved zip, go back to home
if (!submission.value.zip) {
  router.push("/");
}

if (form.value.registerFormPosition !== 'beforeEstimation') {
  useAppStore().setCurrentProgress({
    label: registerForm.value.progress,
    value: 5,
  });
}

const userInput = reactive({
  fullName: submission.value?.subscriber?.fullName || "",
  phone: submission.value?.subscriber?.phone || "",
  email: submission.value?.subscriber?.email || "",
});
const errors = reactive({
  phone: null,
  email: null,
});
const focusing = reactive({
  fullName: false,
  phone: false,
  email: false,
});
watch(
  () => userInput.phone,
  () => {
    if (validatePhone()) {
      errors.phone = null;
    }
  }
);
watch(
  () => userInput.email,
  () => {
    if (validateEmail()) {
      errors.email = null;
    }
  }
);

const loading = ref(false);

function validatePhone() {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!phoneRegex.test(userInput.phone)) {
    errors.phone = "Please enter a valid number";
    return false;
  }
  return true;
}
function validateEmail() {
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      userInput.email
    )
  ) {
    errors.email = "Please enter a valid email";
    return false;
  }
  return true;
}

function validateFormInputs() {
  const validPhone = validatePhone();
  const validEmail = validateEmail();
  return validPhone && validEmail;
}

const strapi = useStrapiClient();

const signupButton = ref();
const error = ref(null);
const buttonTippy = computed(() => ({
  content: error.value ? error.value : null,
  placement: "top",
  trigger: "manual",
}));

const { config: gtagConfig, event: gtagEvent } = useGtag();
async function signUp() {
  if (loading.value) return;
  error.value = null;
  if (!validateFormInputs()) return;
  loading.value = true;
  try {
    const subscriber = await strapi<ISubscriber>("/subscribers", {
      method: "PATCH",
      body: userInput,
    });
    // update submission with subscriber
    const submission = submissionStore.submission;
    submissionStore.setSubmission({
      ...submission,
      form: form.value,
      status: submission?.status || "register",
      progress: submission?.progress || 5,
      stopAt: submission?.stopAt || "Just Signed Up",
      subscriber,
    });
    submissionStore.saveSubmission().catch(() => {
      router.push('/');
    });
    console.log(subscriber);
    // config gtag with user id
    if (isReady.value) {
      gtagConfig({
        user_id: subscriber.id,
      });
      // send event login
      gtagEvent("login", {
        method: "email",
        user_id: subscriber.id,
        user_email: subscriber.email,
        user_name: useNuxtApp().$fullname(subscriber),
      });
    }
    // after signup, if the register form position is before estimation, direct to estimation
    if (form.value.registerFormPosition === 'beforeEstimation') {
      router.push('/estimation');
    }
    // direct to cases
    else {
      router.push("/cases");
    }
  } catch (e) {
    console.dir(e);
    error.value = e.error?.message || e.message;
    await nextTick();
    if (signupButton.value) {
      signupButton.value.$tippy?.show();
    }
  }
  loading.value = false;
}
</script>

<template>
  <div>
    <h1>{{ registerForm.title }}</h1>
    <p v-html="registerForm.description" />
    <form>
      <div class="form-group">
        <input
          v-model.trim="userInput.fullName"
          class="form-input"
          :class="{ focusing: focusing.fullName }"
          type="text"
          required
          :placeholder="registerForm.placeholder.fullName"
          @focus="focusing.fullName = true"
          @blur="focusing.fullName = false"
        />
        <span v-if="focusing.fullName" class="placeholder">
          {{ registerForm.placeholder.fullName }}
        </span>
      </div>
      <div class="form-group">
        <input
          v-model.trim="userInput.phone"
          class="form-input"
          :class="{ focusing: focusing.phone }"
          type="phone"
          required
          :placeholder="registerForm.placeholder.phone"
          @focus="focusing.phone = true"
          @blur="focusing.phone = false"
        />
        <span v-if="focusing.phone" class="placeholder">
          {{ registerForm.placeholder.phone }}
        </span>
        <span v-if="errors.phone" class="error">
          {{ errors.phone }}
          <XIcon />
        </span>
      </div>
      <div class="form-group">
        <input
          v-model.trim="userInput.email"
          class="form-input"
          :class="{ focusing: focusing.email }"
          type="email"
          required
          :placeholder="registerForm.placeholder.email"
          @focus="focusing.email = true"
          @blur="focusing.email = false"
        />
        <span v-if="focusing.email" class="placeholder">
          {{ registerForm.placeholder.email }}
        </span>
        <span v-if="errors.email" class="error">
          {{ errors.email }}
          <XIcon />
        </span>
      </div>
      <div ref="signupButton" v-tippy="buttonTippy" class="btn-signup">
        <CoreButton :loading="loading" @click="signUp">
          {{ registerForm.button }}
        </CoreButton>
      </div>
      <!-- <NuxtLink to="/" class="back">
        <ChevronLeftIcon class="w-5 h-5 mt-1" />
        BACK
      </NuxtLink> -->
    </form>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply !text-xl md:!text-3xl lg:!text-4xl text-center !mb-0;
}
p {
  @apply text-sm md:text-base lg:text-lg font-medium text-center text-red-600;
}
form {
  @apply flex flex-col gap-6 max-w-xl mx-auto py-8;

  .form-group {
    @apply relative;
    .form-input {
      @apply h-10 md:h-12 indent-4 leading-none text-base md:text-lg transition-all;
      &.focusing {
        @apply text-sm md:text-base pt-2;
      }
    }
    .placeholder {
      @apply absolute text-[10px] text-catania-secondary top-0.5 left-4;
    }
    .error {
      @apply text-red-500 flex flex-row gap-1 items-center absolute right-4 top-3 tracking-tighter;

      :deep(svg) {
        @apply w-5 h-5 mt-1;

        path {
          @apply fill-red-700 stroke-red-700 stroke-1;
        }
      }

      @media screen and (max-width: theme("screens.xs")) {
        @apply text-sm top-2 right-1;

        :deep(svg) {
          @apply w-4 h-4;
        }
      }

      @media screen and (max-width: 300px) {
        @apply text-[11px] top-9 gap-0.5;

        :deep(svg) {
          @apply w-2.5 h-2.5 mt-0.5;
        }
      }
    }
  }
  .btn-signup {
    @apply flex justify-center;

    :deep(button) {
      @apply uppercase font-bold lg:h-12;

      @screen md {
        @apply text-base;
      }

      @screen lg {
        @apply text-lg;
      }
    }
  }
  .back {
    @apply cursor-pointer text-catania-secondary font-semibold flex flex-row gap-0.5 items-center mx-auto -mt-4;
  }
}
</style>
