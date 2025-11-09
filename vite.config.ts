import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.tsx"],
            refresh: true,
        }),
        react({
            include: ["**/*.tsx", "**/*.ts"], //["**/*.jsx", "**/*.js"
            babel: {
                plugins: ["@babel/plugin-transform-react-jsx"],
            },
        }),
    ],
    define: {
        "import.meta.env": {},
        "import.meta.glob": {},
    },
    build: {
        manifest: true,
        outDir: "public/build",
        rollupOptions: {
            output: {
                manualChunks: undefined, // ✅ Disable code splitting if issues persist
            },
        },
    },
});
