/// <reference types="vite/client" />

// For Vite 3+
interface ImportMeta {
    readonly glob: <T = unknown>(pattern: string) => Record<string, T>;
}

// Echo types
declare global {
    interface Window {
        Echo: any;
        Pusher: any;
        csrfToken: any;
    }
}
