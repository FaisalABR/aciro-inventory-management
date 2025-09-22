import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// Send cookies with requests so Laravel session cookies are included during
// the /broadcasting/auth POST for private/presence channels.
window.axios.defaults.withCredentials = true;

// Set CSRF token header from blade meta tag so Laravel can validate the request.
const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
if (token) {
    window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allow your team to quickly build robust real-time web applications.
 */

import "./echo";
