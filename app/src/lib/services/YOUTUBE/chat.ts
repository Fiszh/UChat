import { messages } from "$lib/chat";
import { WS_URL } from "$stores/global";
import { settings } from "$stores/settings";
import type { YTNodes } from "youtubei.js";
import { closeWebSocket, TypedEventEmitter } from "$lib/services/eventEmitter";

let modActions = false;

settings.subscribe((cfg) => {
    const foundSetting0 = cfg.find(
        (setting) => setting.param == "modAction",
    ) || {
        value: true,
    };

    if (typeof foundSetting0.value == "boolean")
        modActions = foundSetting0.value;
});

type Events = {
    open: () => void;
    opening: () => void;
    close: () => void;
    error: (data: any) => void;
    raw: (data: any) => void;
};

class YOUTUBESocket extends TypedEventEmitter<Events> {
    url: string;
    ws: WebSocket | null;
    reconnect_attempts: number;
    disconnect_timeout?: ReturnType<typeof setInterval>;
    max_reconnects: number;

    constructor() {
        super();
        this.url = WS_URL + "/youtube";
        this.ws = null;

        this.reconnect_attempts = 0;
        this.max_reconnects = 10;

        this.disconnect_timeout;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener("open", () => {
            console.log("YOUTUBE WS OPEN");
            this.emit("opening");
        });

        this.ws.addEventListener("message", async (event) => {
            //console.log(event);
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return console.error("Failed to parse JSON:", event.data);
            }

            this.emit("raw", data);

            switch (data["type"]) {
                case "welcome":
                    this.emit("open");

                    break;
                case "AddChatItemAction":
                    //console.log(data);

                    const item = (data as YTNodes.AddChatItemAction)["item"];

                    if (
                        "author" in item == false ||
                        "id" in item == false ||
                        "message" in item == false
                    )
                        break;

                    messages.update((msgs) => {
                        const filtered = msgs.filter((m) => m.id != item.id);
                        return [
                            ...filtered.slice(-99),
                            { ...item, service: "GOOGLE" },
                        ];
                    });

                    break;
                case "RemoveChatItemByAuthorAction":
                    if (!modActions) break;

                    messages.update((arr) =>
                        arr.filter((item) => {
                            if (item["service"] != "GOOGLE") return item;
                            if ("author" in item == false) return item;
                            if (
                                item["author"]["id"] !=
                                data["external_channel_id"]
                            )
                                return item;
                        }),
                    );

                    break;
                case "RemoveChatItemAction":
                    if (!modActions) break;

                    messages.update((arr) =>
                        arr.filter((item) => {
                            if (item["service"] != "GOOGLE") return item;
                            if ("author" in item == false) return item;
                            if (item["id"] != data["target_item_id"])
                                return item;
                        }),
                    );

                    break;
                default:
                    break;
            }
        });

        this.ws.addEventListener("close", () => {
            console.log("Disconnected from YouTube WS");
            this.emit("close");

            this.reconnect_attempts++;

            if (this.reconnect_attempts <= this.max_reconnects)
                setTimeout(() => {
                    this.connect();
                }, 1000 * this.reconnect_attempts);
        });

        this.ws.addEventListener("error", (err) => {
            console.error("WebSocket error:", err);
            this.emit("error", err);
        });
    }

    subscribe(channel_id: string) {
        if (!channel_id.startsWith("UC")) return;
        if (!channel_id) throw new Error("Missing 'channel_id' parameter");

        if (this.ws)
            this.ws.send(
                JSON.stringify({ op: "subscribe", channel: channel_id }),
            );

        return true;
    }

    disconnect() {
        this.ws = closeWebSocket(this.ws);
    }
}

export default YOUTUBESocket;
