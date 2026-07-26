const PUBLIC_PREFIXES = ["/recipes", "/categories"];

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/" || PUBLIC_PREFIXES.some((p) => to.path.startsWith(p))) {
    return;
  }
});
