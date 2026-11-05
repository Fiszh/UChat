import type { Snippet } from "svelte";
import { writable } from "svelte/store";

interface DebugInfo {
    images?: (string | Snippet | undefined)[];
    info?: (string | undefined)[];
}

export let debugInfo = writable<DebugInfo | null>(null);
