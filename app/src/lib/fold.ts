import { readable } from "svelte/store";

export const isOpen = readable(false, (set) => {
    const mq = matchMedia("(min-aspect-ratio: 7/10)");
    const update = () => set(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
});
