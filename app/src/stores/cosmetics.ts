import { writable } from 'svelte/store';

interface Cosmetics {
    badges: Record<string, SevenTVBadge>;
    paints: Record<string, Paint>;
    sets: Record<string, any>;
}

export const cosmetics = writable<Cosmetics>({
    badges: {},
    paints: {},
    sets: {}
});
