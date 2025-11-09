// resources/echo.js (Kode yang Benar)

import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Hapus: window.Pusher = Pusher; <-- Jika masih ada

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift() ?? null;
    }
    return null;
}
const csrfToken = getCookie("XSRF-TOKEN");
const IS_SECURE = (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https";
const TARGET_PORT = IS_SECURE
    ? (import.meta.env.VITE_REVERB_PORT ?? 443)
    : (import.meta.env.VITE_REVERB_PORT ?? 8080);

const echoOptions = {
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,

    // ⚠️ Cluster harus ada di sini untuk memuaskan PusherJS
    cluster: "mt1",

    wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.host,
    wsPort: TARGET_PORT,
    wssPort: TARGET_PORT,

    // ⚠️ Gunakan IS_SECURE untuk forceTLS (true di Railway, false di local)
    forceTLS: IS_SECURE,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "/broadcasting/auth",
    auth: {
        headers: {
            "X-CSRF-TOKEN": csrfToken,
            Accept: "application/json",
        },
        withCredentials: true,
    },

    // ❌ HAPUS BLOK 'client: new Pusher(...)' SELURUHNYA!
};

window.Echo = new Echo(echoOptions);

// ----------------------------------------------------
// ⚠️ Binding yang Aman (Ganti semua listener Anda)
// ----------------------------------------------------

// Akses koneksi melalui objek yang lebih stabil
if (window.Echo.connector && window.Echo.connector.connection) {
    window.Echo.connector.connection.bind("connected", () => {
        console.log("✅ Reverb connected successfully");
    });

    window.Echo.connector.connection.bind("error", (err) => {
        console.error("❌ Reverb connection error:", err);
    });

    window.Echo.connector.connection.bind("state_change", (states) => {
        console.log("🔄 Reverb state change:", states);
    });
}
