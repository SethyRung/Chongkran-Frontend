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
  <div></div>
</template>
