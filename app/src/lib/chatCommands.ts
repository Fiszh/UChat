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
                window.location.reload();

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
            default:
                break;
        }
    }
}
