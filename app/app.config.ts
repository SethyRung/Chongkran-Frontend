export default defineAppConfig({
  ui: {
    colors: {
      primary: "primary",
    },
    navigationMenu: {
      compoundVariants: [
        {
          variant: "pill",
          active: true,
          highlight: false,
          class: {
            link: "before:bg-transparent",
          },
        },
      ],
    },
  },
});
