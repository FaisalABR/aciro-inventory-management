import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import React from "react";
import "./bootstrap";

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
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
