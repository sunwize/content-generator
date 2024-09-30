// https://nuxt.com/docs/api/configuration/nuxt-config
import Icons from "unplugin-icons/vite";

export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: false },
    css: ["~/assets/style/main.css", "highlight.js/styles/atom-one-dark.css"],
    vite: {
        plugins: [
            Icons({
                compiler: "vue3",
            }),
        ],
    },
    modules: ["@nuxt/ui"],
    colorMode: {
        preference: "dark",
    },
});