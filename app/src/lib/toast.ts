import { writable } from "svelte/store";
import { generateUUID } from "./overlayIndex";

export interface ToastNotif {
    id: string;
    msg: string;
    type: "info" | "error" | "success";
    dismissible: boolean;
    timeout: number;
}

type AddToastInput = Pick<ToastNotif, "msg"> &
    Partial<Omit<ToastNotif, "msg" | "id">>;

export const toastNotifs = writable<ToastNotif[]>([]);

export function addToast(toast: AddToastInput) {
    const defaults: Omit<ToastNotif, "msg"> = {
        id: generateUUID(),
        type: "info",
        dismissible: true,
        timeout: 3,
    };

    const timeout = (toast.timeout ?? defaults.timeout) * 1000;

    toastNotifs.update((t) => [
        {
            ...defaults,
            ...toast,
            timeout,
        },
        ...t,
    ]);

    if (toast.timeout ?? defaults.timeout)
        setTimeout(() => dismissToast(defaults["id"]), timeout);
}

export const dismissToast = (id: ToastNotif["id"]) =>
    toastNotifs.update((t) => t.filter((notif) => notif.id !== id));
