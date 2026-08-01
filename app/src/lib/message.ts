import { messages } from "./chat";

export function removeMessage(id: string, platform?: Platforms) {
    messages.update((arr) => {
        const msg = arr.find(
            (m) =>
                m.tags["id"] == id && (!platform || m["service"] == platform),
        );

        if (msg) msg.removed = true;

        return arr;
    });
}
