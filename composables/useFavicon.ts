import { useFormStore } from "~~/store/form";

export const useFavicon = () => {
  useMeta({
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: computed(() => useFormStore().form?.favicon?.url || "/favicon.png"),
      },
    ],
  });
};