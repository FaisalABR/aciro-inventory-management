import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(";").shift() ?? null;
    }
    return null;
}
// Get CSRF token
const csrfToken = getCookie("XSRF-TOKEN");

if (!csrfToken) {
    console.error(
        "❌ CSRF token not found! Pastikan window.csrfToken disuntikkan di Blade.",
    );
}

const echoOptions = {
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: "/broadcasting/auth",
    // Ini penting untuk private channel auth
    auth: {
        headers: {
            "X-CSRF-TOKEN": csrfToken,
            Accept: "application/json",
        },
        withCredentials: true,
    },
};

window.Echo = new Echo(echoOptions);

// Add connection event listeners for debugging
if (window.Echo.connector && window.Echo.connector.pusher) {
    window.Echo.connector.pusher.connection.bind("connected", () => {
        console.log("✅ Reverb connected successfully");
    });

    window.Echo.connector.pusher.connection.bind("error", (err) => {
        console.error("❌ Reverb connection error:", err);
    });

    window.Echo.connector.pusher.connection.bind("state_change", (states) => {
        console.log("🔄 Reverb state change:", states);
    });
}
