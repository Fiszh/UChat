import { loadingInfo, multiplatformBadge } from "$stores/global";
import { get } from "svelte/store";
import { loadChat } from "./loadChat";
import Services from "./services";

export const UChatMods: Record<Platforms, string[]> = {
    TWITCH: ["528761326", "166427338"],
    KICK: ["1235565", "116386"],
    GOOGLE: [],
};

export const isUChatMod = (platform: Platforms, userid: string) =>
    UChatMods[platform].includes(userid);

export function execCommand(message: string) {
    if (message.startsWith("!")) {
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
                    Services["7TV"].ws.close();
                    Services["BTTV"].ws.close();
                } catch (err) {} // HERE JUST IN CASE THE WEBSOCKET IS NOT OPEN

                break;
            case "reconnectchat":
                Services["TWITCH"]["ws"].disconnect();
                Services["KICK"]["ws"].disconnect();
                Services["GOOGLE"]["ws"].disconnect();

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
                        text: "Chat Version: " + __APP_VERSION,
                        type: "minimal",
                    });
                }

                break;
            case "hideloading":
                loadingInfo.set({
                    text: undefined,
                    type: undefined,
                });

                break;
            case "multiplatform":
            case "multichat":
                multiplatformBadge.set(!get(multiplatformBadge));

                break;
            default:
                break;
        }
    }
}
