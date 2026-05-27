import { loadingInfo } from "$stores/global";
import { overlayVersion } from "$stores/settings";
import { get } from "svelte/store";
import { disconnect } from "./chat";
import { loadChat } from "./loadChat";
import { services } from "./services";

const UChatMods = ["528761326", "166427338"];

export function execCommand(message: string, tags: Record<string, any>) {
    if (
        message.startsWith("!") &&
        (UChatMods.includes(tags["user-id-raw"]) ||
            tags?.mod ||
            tags?.["badges-raw"]?.includes("broadcaster/1"))
    ) {
        switch (
            message
                .toLowerCase()
                .trim()
                .replace(/^(!uchat\s|!)/, "")
        ) {
            case "reloadchat":
                const url = new URL(window.location.href);
                url.searchParams.set("_cb", Date.now().toString());
                window.location.replace(url.toString());

                break;
            case "refreshchat":
                loadChat(true);

                break;
            case "reloadws":
                try {
                    services["7TV"].ws.close();
                    services["BTTV"].ws.close();
                } catch (err) {} // HERE JUST IN CASE THE WEBSOCKET IS NOT OPEN

                break;
            case "reconnectchat":
                disconnect();

                break;
            case "chatversion":
            case "version":
                const loadInfo = get(loadingInfo);

                if (loadInfo.text) {
                    loadingInfo.set({
                        text: undefined,
                        type: undefined,
                    });
                } else {
                    loadingInfo.set({
                        text: "Chat Version: " + get(overlayVersion),
                        type: "minimal",
                    });
                }

                break;
            case "hideLoading":
                loadingInfo.set({
                    text: undefined,
                    type: undefined,
                });

                break;
            default:
                break;
        }
    }
}
