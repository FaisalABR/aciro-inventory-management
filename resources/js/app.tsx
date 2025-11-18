import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import React from "react";
import "./bootstrap";

const resolvePageComponent = (name: string) => {
    const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });

    // Pastikan tidak ada kode lain di sini yang bisa menyebabkan promise/minification conflict
    return pages[`./Pages/${name}.tsx`];
};

createInertiaApp({
    resolve: resolvePageComponent,
    setup({
        el,
        App,
        props,
    }: {
        el: Element;
        App: React.ComponentType<any>; // <-- Key fix
        props: Record<string, unknown>;
    }) {
        createRoot(el).render(<App {...props} />);
    },
});
