import * as Sentry from "@sentry/nuxt";

const config = useRuntimeConfig();

Sentry.init({
  dsn: config.public.sentry.dns,
  tracesSampleRate: 1.0,
  debug: false,
});
