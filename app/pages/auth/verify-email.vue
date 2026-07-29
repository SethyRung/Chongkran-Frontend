<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

useHead({
  title: "Verify email · Chongkran",
  meta: [
    {
      name: "description",
      content: "Confirm your email address to finish setting up your Chongkran account.",
    },
  ],
});

const route = useRoute();

const email = computed(() => {
  const raw = route.query.email;
  return typeof raw === "string" ? raw : "";
});

const resent = ref(false);
const resending = ref(false);
const errorMessage = ref<string | null>(null);

async function resend() {
  if (!email.value || resending.value) return;
  resending.value = true;
  errorMessage.value = null;
  try {
    const client = useAuthClient();
    await client?.sendVerificationEmail({
      email: email.value,
      callbackURL: "/",
    });
    resent.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Could not resend the verification email.";
  } finally {
    resending.value = false;
  }
}
</script>

<template>
  <div class="text-center py-4">
    <div
      class="mx-auto size-16 rounded-full bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-6"
    >
      <UIcon
        :name="email ? 'i-lucide-mail-check' : 'i-lucide-mail-question'"
        class="size-8 text-primary"
      />
    </div>

    <h1 class="text-3xl font-semibold tracking-tight text-highlighted">
      {{ email ? "Check your inbox" : "Verify your email" }}
    </h1>

    <p class="mt-3 text-base text-muted leading-relaxed">
      <template v-if="email">
        We sent a verification link to
        <span class="font-medium text-default break-all">{{ email }}</span
        >. Open it to finish setting up your account.
      </template>
      <template v-else>
        We sent you a verification link when you signed up. Open it to finish setting up your
        account.
      </template>
    </p>

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      :title="errorMessage"
      icon="i-lucide-alert-circle"
      class="mt-6 text-left"
    />

    <UAlert
      v-else-if="resent"
      color="success"
      variant="subtle"
      title="Email sent"
      description="A fresh verification link is on its way. Give it a minute to arrive."
      icon="i-lucide-check-circle"
      class="mt-6 text-left"
    />

    <div class="mt-8 flex flex-col items-center gap-3">
      <UButton
        v-if="email"
        :label="resent ? 'Resend again' : 'Resend verification email'"
        size="lg"
        :loading="resending"
        :disabled="resending || resent"
        @click="resend"
      />
      <NuxtLink to="/auth/login" class="text-sm text-muted hover:text-default transition-colors">
        ← Back to sign in
      </NuxtLink>
    </div>
  </div>
</template>
