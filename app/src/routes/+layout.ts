import { API_URL } from "$stores/global";
import type { LoadEvent } from "@sveltejs/kit";
import { browser } from "$app/environment";
import "$lib/i18n";
import { waitLocale } from "svelte-i18n";

export const load = async ({ fetch }: LoadEvent) => {
    const isEmbedded = browser ? window.top !== window.self : false;
    const embedderUrl = browser && isEmbedded ? document.referrer : null;

    try {
        await waitLocale();
        const res = await fetch(API_URL + `/status`);
        const data = await res.json();
        return {
            statusMessage: data as StatusMessage,
            isEmbedded,
            embedderUrl,
        };
    } catch {
        return { statusMessage: null, isEmbedded, embedderUrl };
    }
};
