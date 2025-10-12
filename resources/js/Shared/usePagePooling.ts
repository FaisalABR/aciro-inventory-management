import { useEffect, useRef } from "react";
import { router } from "@inertiajs/react";

interface UsePagePollingOptions {
    /** Interval dalam milidetik, default 5000 */
    interval?: number;
    /** Props Inertia yang ingin direload saja */
    only?: string[];
    /** Apakah polling aktif dari awal (default true) */
    enabled?: boolean;
}

export default function usePagePolling({
    interval = 5000,
    only = [],
    enabled = true,
}: UsePagePollingOptions = {}) {
    const intervalRef = useRef<number | null>(null);

    const startPolling = () => {
        if (intervalRef.current) return; // prevent double start
        console.log("▶️ start polling");

        intervalRef.current = window.setInterval(() => {
            router.reload({ only });
        }, interval);
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log("⏹️ stop polling");
        }
    };

    useEffect(() => {
        if (!enabled) return;

        startPolling();

        // stop when user switch tab
        window.addEventListener("blur", stopPolling);
        window.addEventListener("focus", startPolling);

        return () => {
            stopPolling();
            window.removeEventListener("blur", stopPolling);
            window.removeEventListener("focus", startPolling);
        };
    }, [enabled, interval, only]);
}
