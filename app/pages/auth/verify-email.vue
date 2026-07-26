<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const route = useRoute();
const toast = useToast();

const email = computed(() => {
  const raw = route.query.email;
  return typeof raw === "string" ? raw : "";
});

const resent = ref(false);
const resending = ref(false);

async function resend() {
  if (!email.value || resending.value) return;
  resending.value = true;
  try {
    const client = useAuthClient();
    await client?.sendVerificationEmail({
      email: email.value,
      callbackURL: "/",
    });
    resent.value = true;
    toast.add({
      title: "Verification email sent",
      description: `Check ${email.value} for a new link.`,
      color: "success",
      icon: "i-lucide-check-circle",
    });
  } catch (err) {
    toast.add({
      title: "Could not resend",
      description: "Please try again in a moment.",
      color: "error",
      icon: "i-lucide-alert-circle",
    });
  } finally {
    resending.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center text-center space-y-6">
    <UIcon name="i-lucide-mail-check" class="text-primary size-16" />

    <div class="space-y-2">
      <h1 class="text-2xl font-bold">Check your inbox</h1>
      <p class="text-muted">
        We've sent a verification link to
        <span v-if="email" class="font-medium text-default">{{ email }}</span>
        <span v-else>your email address</span>.
      </p>
      <p class="text-muted text-sm">
        Click the link to confirm your address and sign in. The link expires in 1 hour.
      </p>
    </div>

    <div class="flex flex-col gap-3 w-full max-w-xs">
      <UButton
        v-if="email"
        :label="resent ? 'Verification email resent' : 'Resend verification email'"
        :loading="resending"
        :disabled="resent"
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="outline"
        block
        @click="resend"
      />

      <UButton to="/auth" label="Back to sign in" variant="ghost" block />
    </div>
  </div>
</template>
