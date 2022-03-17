<script setup lang="ts">
import { ChevronLeftIcon, XIcon } from "@heroicons/vue/solid";
import { useFormStore } from "~~/store/form";
import CoreButton from "~~/components/core/Button.vue";

definePageMeta({
  layout: "form",
  title: "Sign Up",
});

const formStore = useFormStore();
const form = computed(() => formStore.form);
const registerForm = computed(() => form.value.registerForm);

formStore.setProgress({
  label: registerForm.value.progress,
  value: 5,
});

const userInput = reactive({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
});
const errors = reactive({
  phone: null,
  email: null,
});
const focusing = reactive({
  firstName: false,
  lastName: false,
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
  if (!userInput.email.includes("@")) {
    errors.email = "Please enter a valid email";
    return false;
  }
  return true;
}

function validateFormInputs() {
  return validateEmail() && validatePhone();
}

async function signUp() {
  if (loading.value) return;
  if (!validateFormInputs()) return;
  loading.value = true;
  const res = await useStrapiAuth().register({
    username: userInput.email,
    email: userInput.email,
    password: Math.random().toString(36).substring(2, 15),
    firstName: userInput.firstName,
    lastName: userInput.lastName,
    phone: userInput.phone,
  });
  console.log(res);
  loading.value = false;
}
</script>

<template>
  <div v-if="registerForm">
    <h1>{{ registerForm.title }}</h1>
    <p v-html="registerForm.description" />
    <form>
      <div class="form-group">
        <input
          v-model.trim="userInput.firstName"
          class="form-input"
          :class="{ focusing: focusing.firstName }"
          type="text"
          required
          :placeholder="registerForm.placeholder.firstName"
          @focus="focusing.firstName = true"
          @blur="focusing.firstName = false"
        />
        <span v-if="focusing.firstName" class="placeholder">
          {{ registerForm.placeholder.firstName }}
        </span>
      </div>
      <div class="form-group">
        <input
          v-model.trim="userInput.lastName"
          class="form-input"
          :class="{ focusing: focusing.lastName }"
          type="text"
          required
          :placeholder="registerForm.placeholder.lastName"
          @focus="focusing.lastName = true"
          @blur="focusing.lastName = false"
        />
        <span v-if="focusing.lastName" class="placeholder">
          {{ registerForm.placeholder.lastName }}
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
      <CoreButton class="btn-signup" :loading="loading" @click="signUp">
        {{ registerForm.button }}
      </CoreButton>
      <a class="back" @click="$router.back()">
        <ChevronLeftIcon class="w-5 h-5 mt-1" />
        BACK
      </a>
    </form>
  </div>
</template>

<style scoped lang="postcss">
h1 {
  @apply !text-4xl text-center !mb-0;
}
p {
  @apply text-lg font-medium text-center text-red-600;
}
form {
  @apply flex flex-col gap-6 max-w-xl mx-auto py-8;

  .form-group {
    @apply relative;
    .form-input {
      @apply h-12 indent-4 leading-none text-lg transition-all;
      &.focusing {
        @apply text-base;
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
    }
  }
  .btn-signup {
    @apply mx-4 uppercase font-bold text-lg h-12;
  }
  .back {
    @apply cursor-pointer text-catania-secondary font-semibold flex flex-row gap-0.5 items-center mx-auto -mt-4;
  }
}
</style>
