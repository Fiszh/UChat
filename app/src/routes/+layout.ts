import { API_URL } from "$stores/global";
import type { LoadEvent } from "@sveltejs/kit";
import "$lib/i18n";
import { waitLocale } from "svelte-i18n";

export const load = async ({ fetch }: LoadEvent) => {
    try {
        await waitLocale();
        const res = await fetch(API_URL + `/status`);
        const data = await res.json();
        return { statusMessage: data as StatusMessage };
    } catch {
        return { statusMessage: null };
    }
};
