import { messages, sanitizeInput } from "$lib/chat";
import { execCommand, isUChatMod } from "$lib/chatCommands";
import { globals } from "$stores/global";
import { settings } from "$stores/settings";
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

interface PusherBadge {
    type: string;
    text: string;
    sort_order: number;
}

type Events = {
    open: () => void;
    first_open: () => void;
    opening: () => void;
    close: () => void;
    error: (data: any) => void;
    sent: (data: any) => void;
    send_error: (data: any) => void;
    raw: (data: any) => void;
    subbed: (topic: string) => void;
};

class KICKSocket extends TypedEventEmitter<Events> {
    url: string;
    ws: WebSocket | null;
    first_open: boolean;
    silent: boolean;
    subscriptions: string[];
    reconnect_attempts: number;
    disconnect_timeout?: ReturnType<typeof setInterval>;
    max_reconnects: number;

    constructor() {
        super();
        this.url =
            "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.5.0&flash=false";
        this.ws = null;
        this.first_open = true;
        this.silent = false;
        this.subscriptions = [];

        this.reconnect_attempts = 0;
        this.max_reconnects = 10;

        this.disconnect_timeout;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener("open", () => {
            console.log("KICK WS OPEN");
            this.emit("opening");

            //this.emit("open"); -- on event connection_established
        });

        this.ws.addEventListener("message", async (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return console.error("Failed to parse JSON:", event.data);
            }

            this.emit("raw", data);

            switch (data.event) {
                case "pusher:connection_established":
                    // RESUB TO EVERY TOPIC
                    for (const topic of this.subscriptions)
                        this.subscribe(topic, false, true);

                    if (this.first_open) {
                        this.first_open = false;
                        this.emit("first_open");
                    } else {
                        this.emit("open");
                    }

                    break;
                case "pusher_internal:subscription_succeeded":
                    this.emit("subbed", data.channel as string);

                    break;
                case "App\\Events\\ChatMessageEvent":
                    let parsedMessage = JSON.parse(data.data);

                    parsedMessage.content = sanitizeInput(
                        parsedMessage.content,
                    );

                    parsedMessage = {
                        ...parsedMessage,
                        service: "KICK",
                    };

                    if (
                        isUChatMod(
                            "KICK",
                            String(parsedMessage["sender"]["id"]),
                        ) ||
                        parsedMessage?.["sender"]?.["identity"]?.[
                            "badges"
                        ].find((b: PusherBadge) => b["type"] == "moderator") ||
                        String(parsedMessage["sender"]["id"]) ==
                            globals["channels"]["KICK"]["userID"] // i guess user id????
                    )
                        execCommand(parsedMessage.content);

                    messages.update((msgs) => [
                        ...msgs.slice(-99),
                        parsedMessage,
                    ]);

                    break;
                case "App\\Events\\UserBannedEvent":
                    let parsedBanNotif = JSON.parse(data.data);

                    messages.update((arr) =>
                        arr.filter((item) => {
                            if (item["service"] != "KICK") return item;
                            if ("sender" in item == false) return item;
                            if (
                                item["sender"]["id"] !=
                                parsedBanNotif["user"]["id"]
                            )
                                return item;
                        }),
                    );

                    break;
                case "App\\Events\\MessageDeletedEvent":
                    if (!modActions) break;

                    let parsedDeletionNotif = JSON.parse(data.data);

                    messages.update((arr) =>
                        arr.filter((item) => {
                            if (item["service"] != "KICK") return item;
                            if (
                                item["id"] !=
                                parsedDeletionNotif["message"]["id"]
                            )
                                return item;
                        }),
                    );

                    break;
                case "App\\Events\\ChatroomClearEvent":
                    if (!modActions) break;

                    messages.update((arr) =>
                        arr.filter((item) => item["service"] != "KICK"),
                    );

                    break;
                default:
                    break;
            }
        });

        this.ws.addEventListener("close", () => {
            console.log("Disconnected from KICK PUSHER");
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

    subToChannelId(id: string | number, chatroom_id: string | number) {
        const topics = [
            `channel_${id}`,
            `channel.${id}`,
            `chatrooms.${chatroom_id}`,
            `chatrooms.${chatroom_id}.v2`,
            `chatroom_${chatroom_id}`,
        ];

        for (const topic of topics) this.subscribe(topic);
    }

    subscribe(topic: string, silent: boolean = this.silent, force?: boolean) {
        if (!topic) throw new Error("Missing 'topic' parameter");

        if (this.subscriptions.includes(topic) && !force) {
            if (!silent) {
                throw new Error(`Already subscribed`);
            } else {
                return;
            }
        }

        if (!this.subscriptions.includes(topic)) this.subscriptions.push(topic);

        const message = {
            event: "pusher:subscribe",
            data: { auth: "", channel: topic },
        };

        if (this.ws) this.ws.send(JSON.stringify(message));

        return true;
    }

    unsubscribe(topic: string) {
        if (!topic) throw new Error("Missing 'topic' parameter");
        if (!this.subscriptions.includes(topic))
            throw new Error("Not subscribed!");

        const message = {
            event: "pusher:subscribe",
            data: { auth: "", channel: topic },
        };

        if (this.ws) this.ws.send(JSON.stringify(message));

        return true;
    }

    disconnect() {
        this.ws = closeWebSocket(this.ws);
    }
}

export default KICKSocket;
