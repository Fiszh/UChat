import { settings } from "$stores/settings";
import { execCommand, isUChatMod } from "$lib/chatCommands";
import { messages, sanitizeInput } from "$lib/chat";
import { globals } from "$stores/global";
import { closeWebSocket, TypedEventEmitter } from "$lib/services/eventEmitter";

let modActions = false;
let usernotices = false;

settings.subscribe((cfg) => {
    const foundSetting0 = cfg.find(
        (setting) => setting.param == "modAction",
    ) || {
        value: true,
    };

    const foundSetting1 = cfg.find((setting) => setting.param == "redeem") || {
        value: true,
    };

    if (typeof foundSetting0.value == "boolean")
        modActions = foundSetting0.value;
    if (typeof foundSetting1.value == "boolean")
        usernotices = foundSetting1.value;
});

interface ParsedMessage {
    raw: string;
    tags:
        | {
              rawTags: Record<string, any>;
              tags: Record<string, any>;
              merged: Record<string, any>;
          }
        | Record<string, any>;
    prefix: Record<string, string>;
    command: string;
    channel: string;
    message: string;
    service: "TWITCH";
}

const MAX_RECONNECTS = 10;

export function assignMessage(parsed: ReturnType<typeof parseIRCLine>) {
    switch (parsed.command) {
        case "CLEARMSG":
            if (!modActions) break;

            messages.update((arr) =>
                arr.filter((item) => {
                    if (item["service"] != "TWITCH") return item;
                    if ("tags" in item == false) return item;
                    if (item.tags["id"] != parsed.tags.merged["target-msg-id"])
                        return item;
                }),
            );

            break;
        case "CLEARCHAT":
            if (!modActions) break;

            if (parsed.tags.merged["target-user-id"]) {
                messages.update((arr) =>
                    arr.filter((item) => {
                        if (item["service"] != "TWITCH") return item;
                        if ("tags" in item == false) return item;
                        if (
                            item.tags["user-id"] !=
                            parsed.tags.merged["target-user-id"]
                        )
                            return item;
                    }),
                );
            } else {
                messages.update((arr) =>
                    arr.filter((item) => item["service"] != "TWITCH"),
                );
            }

            break;
        case "PRIVMSG":
            parsed.tags = (parsed.tags.merged ?? parsed.tags) as Record<
                string,
                any
            >;

            if (
                isUChatMod("TWITCH", parsed.tags["user-id-raw"]) ||
                parsed["tags"]["mod"] ||
                (parsed.tags["user-id-raw"] as string) ==
                    globals["channels"]["TWITCH"]["ID"]
            )
                execCommand(parsed.message);

            messages.update((msgs) => [...msgs.slice(-99), parsed]);

            break;
        case "USERNOTICE":
            if (!usernotices) break;

            parsed.tags = parsed.tags.merged ?? parsed.tags;

            if (parsed.message && (parsed.tags as any).login) {
                (parsed.tags as any).username = (parsed.tags as any).login;

                messages.update((msgs) => [...msgs.slice(-99), parsed]);
            }

            break;
        default:
            //console.log("UNKNOWN PARSED COMMAND", parsed.command, parsed);

            break;
    }
}

type Events = {
    open: () => void;
    opening: () => void;
    close: () => void;
    error: (data: any) => void;
    raw: (data: any) => void;
};

export class TWITCHSocket extends TypedEventEmitter<Events> {
    readonly url: string;
    readonly req: string[];
    ws: WebSocket | null;
    reconnect_attempts: number;
    disconnect_timeout?: ReturnType<typeof setInterval>;
    max_reconnects: number;

    constructor() {
        super();
        this.url = "wss://irc-ws.chat.twitch.tv:443";
        this.req = [
            "twitch.tv/tags",
            "twitch.tv/commands",
            "twitch.tv/membership",
        ];
        this.ws = null;

        this.reconnect_attempts = 0;
        this.max_reconnects = 10;

        this.disconnect_timeout;
    }

    connect() {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener("open", () => {
            this.emit("opening");

            this.reconnect_attempts = 0;

            this.ws?.send("CAP REQ :" + this.req.join(" "));
            this.ws?.send(`NICK justinfan${Math.floor(Math.random() * 9999)}`);

            console.log("Connected to Twitch IRC WebSocket");
            this.emit("open");
        });

        this.ws.addEventListener("message", (event) => {
            try {
                const messagesSplit = event.data.split("\r\n");

                this.emit("raw", event.data);

                for (const line of messagesSplit) {
                    if (!line) continue;
                    const parsed = parseIRCLine(line);

                    if (parsed["command"] == "PING") {
                        this.ws?.send("PONG :tmi.twitch.tv");

                        if (this.disconnect_timeout)
                            clearTimeout(this.disconnect_timeout);
                        this.disconnect_timeout = setTimeout(
                            this.disconnect,
                            25 * 1000,
                        );
                    } else if (parsed["command"] == "RECONNECT") {
                        this.disconnect();
                    } else {
                        assignMessage(parsed);
                    }
                }
            } catch (err) {
                console.error("Error in message handler:", err);
            }
        });

        this.ws.addEventListener("close", () => {
            console.log("Disconnected from Twitch IRC");
            this.emit("close");

            this.reconnect_attempts++;

            if (this.reconnect_attempts <= MAX_RECONNECTS)
                setTimeout(() => {
                    this.connect();
                }, 1000 * this.reconnect_attempts);
        });

        this.ws.addEventListener("error", (err) => {
            console.error("WebSocket error:", err);
            this.emit("error", err);
        });
    }

    join = (channel_name: string) => this.ws?.send("JOIN #" + channel_name);

    disconnect() {
        this.ws = closeWebSocket(this.ws);
    }
}

/*NOTE PARSING MIGHT NOT WORK 100%*/
export function parseIRCLine(raw: string): ParsedMessage {
    let parsed: ParsedMessage = {
        raw,
        tags: {
            rawTags: {},
            tags: {},
            merged: {},
        },
        prefix: {},
        command: "",
        channel: "",
        message: "",
        service: "TWITCH",
    };

    try {
        // SPLIT TAGS AND REST
        let lineTags = "";
        let rawPrefix = "";
        let line = raw;

        if (line.startsWith("@")) {
            const [tagsPart, ...restParts] = line.split(" ");
            lineTags = tagsPart.slice(1);
            line = restParts.join(" ");

            rawPrefix = line.split(" ")[0];

            const end = line.indexOf(" ");
            line = line.slice(end + 1);
        }

        if (line.startsWith(":")) {
            const end = line.indexOf(" ");
            line = line.slice(end + 1);
        }

        const space = line.indexOf(" ");
        const command = space === -1 ? line : line.slice(0, space);
        const trailing =
            space === -1 ? null : line.slice(space + 1).replace(/^:/, "");

        // GET PARTS OF REST
        const [channel, ...messageParts] = (trailing || "").split(" ");

        // GET AND CLEAN MESSAGE
        const message = messageParts.join(" ");
        let cleanMessage = message.startsWith(":") ? message.slice(1) : message;

        // CLEAN AND GET PREFIX
        const clean = rawPrefix.startsWith(":")
            ? rawPrefix.slice(1)
            : rawPrefix;

        const [nickPart, host] = clean.split("@");
        const [nick, user] = nickPart.split("!");

        const prefix = { nick, user, host };

        // GENERATE RAW AND PARSED TAGS
        const ircEscapedChars: Record<string, string> = {
            s: " ",
            n: "\n",
            r: "\r",
            ":": ";",
            "\\": "\\",
        };

        const tagsSplit = lineTags.split(";");

        const rawTags = Object.fromEntries(
            tagsSplit.map((tag: string) => {
                const [key, value] = tag.split("=");
                const unescaped =
                    value?.replace(
                        /\\(.)/g,
                        (_, c) => ircEscapedChars[c] ?? c,
                    ) ?? null;
                return [key, unescaped];
            }),
        );

        const isNumber = (str: string) => !isNaN(Number(str));

        const tags: Record<string, any> = {};
        const TAG_VALUE_REGEX = /([^,\/]+)\/([^,]+)/g;
        const EMOTE_POSITIONS_REGEX = /([^\/:]+):([\d,-]+)/g;

        Object.entries(rawTags).forEach(([key, value]) => {
            if (isNumber(value) && value !== "") {
                const numberValue = Number(value);

                tags[key] =
                    numberValue > 1 ? numberValue : Boolean(numberValue);
            } else {
                let matches = [];
                let matchesType = "TAG_VALUE_REGEX";

                if (value.includes(":")) {
                    matches = [...value.matchAll(EMOTE_POSITIONS_REGEX)];

                    matchesType = "EMOTE_POSITIONS_REGEX";
                } else {
                    matches = [...value.matchAll(TAG_VALUE_REGEX)];
                }

                if (matches.length) {
                    for (const match of matches) {
                        const [, id, nums] = match;

                        if (matchesType == "TAG_VALUE_REGEX") {
                            if (!tags[key]) {
                                tags[key] = {};
                            }

                            tags[key][id] = nums;
                        } else if (matchesType == "EMOTE_POSITIONS_REGEX") {
                            if (!tags[key]) {
                                tags[key] = [];
                            }

                            tags[key][id] = [...nums.split(",")];
                        }
                    }
                } else {
                    tags[key] = value;
                }
            }
        });

        function addTag(key: string, value: any) {
            if (Object.values(rawTags).length) rawTags[key] = value;
            if (Object.values(tags).length) tags[key] = value;
        }

        // INSTERT USERNAME INTO TAGS
        if (prefix["nick"]) {
            addTag("username", prefix["nick"]);
        }

        // ADD ACTION TAG
        if (
            typeof cleanMessage === "string" &&
            cleanMessage.startsWith("\x01ACTION") &&
            cleanMessage.endsWith("\x01")
        ) {
            addTag("action", true);

            cleanMessage = cleanMessage.slice(8, -1);
        } else {
            addTag("action", false);
        }

        // MERGE RAW AND NORMAL TAGS
        const merged = {
            ...Object.fromEntries(
                Object.entries(rawTags).map(([key, value]) => [
                    `${key}-raw`,
                    value,
                ]),
            ),
            ...tags,
        };

        // REMOVE HTML TAGS
        cleanMessage = sanitizeInput(cleanMessage);

        // RETURN PARSED
        parsed = {
            ...parsed,
            raw: line,
            tags: {
                rawTags,
                tags,
                merged,
            },
            prefix,
            command,
            channel,
            message: cleanMessage,
        };
    } catch (err) {
        console.error("Failed parsing:", raw, " With the error:", err);
    } finally {
        return parsed;
    }
}
