export default defineNuxtRouteMiddleware((to, _from) => {
  const isAuthenticated = useCookie<boolean>("authenticated");

  const authRoutes = ["/auth/login", "/auth/sign-up"];

  if (authRoutes.includes(to.fullPath)) {
    if (isAuthenticated.value) {
      return navigateTo("/");
    }
    return;
  }
});
