import { writable } from "svelte/store";

export interface DefaultSetting {
    name: string;
    param: string;
    description?: string;
    hide?: boolean;
    previewReact?: boolean;
}

interface NumberSetting extends DefaultSetting {
    type: "number";
    value: number;
    default?: number;
}

interface TextSetting extends DefaultSetting {
    type: "text";
    value: string;
    default?: string;
    list?: boolean;
}

interface BooleanSetting extends DefaultSetting {
    type: "boolean";
    value: boolean;
    default?: boolean;
}

interface ColorPickerSetting extends DefaultSetting {
    type: "color-picker";
    value: string;
    default?: string;
}

export type Setting =
    | NumberSetting
    | TextSetting
    | BooleanSetting
    | ColorPickerSetting;

const defaultEmoteSize = 25;

export const setEmoteSize = writable<number>(defaultEmoteSize);

export const configs: Setting[] = [
    {
        name: "Message are in <strong>bold</strong> text",
        type: "boolean",
        value: true,
        param: "msgBold",
        description: "Make messages bold",
    },
    {
        name: "Message are in UPPERCASE",
        type: "boolean",
        value: false,
        param: "msgCaps",
        description: "Convert all chat message text to uppercase",
    },
    {
        name: "Smooth message scroll",
        type: "boolean",
        param: "smoothScroll",
        value: true,
        description:
            "Animate scrolling for new messages when possible, may jump if messages arrive rapidly",
    },
    {
        name: "Custom chat font",
        type: "text",
        value: "Geist",
        param: "font",
        description: "Change the chat message font",
    },
    {
        name: "Chat font color (hex)",
        type: "color-picker",
        value: "#FFFFFF",
        param: "fontColor",
        description: "Change the chat text color",
    },
    {
        name: "Font & Badge size (px)",
        type: "number",
        param: "fontSize",
        value: 20,
        previewReact: false,
        description:
            "Set the size of message text and badges in pixels, changing this will also automatically scale emotes",
    },
    {
        name: "Font stroke",
        type: "boolean",
        value: false,
        param: "fontStroke",
        description:
            "Enable an outline stroke around chat text for readability (note: outline does not apply to 7TV paints)",
    },
    {
        name: "Message shadow (0-10)",
        type: "number",
        param: "fontShadow",
        value: 10,
        description: "Add a shadow behind message",
    },
    {
        name: "Emote size (px)",
        type: "number",
        param: "emoteSize",
        value: defaultEmoteSize,
        previewReact: false,
        description:
            "Set the display size of emotes in pixels, scales with font size setting if not set",
    },
    {
        name: "Text fade out (seconds)",
        type: "number",
        param: "fadeOut",
        value: 0,
        previewReact: false,
        description:
            "Automatically fade out messages after the specified number of seconds",
    },
    {
        name: "Display badges",
        type: "boolean",
        value: true,
        param: "badges",
        description: "Show or hide user badges (moderator, subscriber, etc.)",
    },
    {
        name: "Display only Twitch badges",
        type: "boolean",
        value: false,
        hide: true,
        param: "badgesTTV",
        description: "When enabled, only Twitch badges will be displayed",
    },
    {
        name: "Display Redeems & Usernotices",
        type: "boolean",
        value: true,
        param: "redeem",
        description:
            "Show channel points redeems, subscriptions, and announcements in chat",
    },
    {
        name: "Hide bot messages",
        type: "boolean",
        value: true,
        param: "bots",
        description:
            "Hide messages from chat bots, detected using Twitch & FFZ bot badges",
    },
    {
        name: "Custom user blacklist (separate using spaces)",
        type: "text",
        value: "",
        param: "userBL",
        list: true,
        description: "Space-separated list of usernames to hide from chat",
    },
    {
        name: "Custom prefix blacklist (separate using spaces)",
        type: "text",
        value: "",
        param: "prefixBL",
        list: true,
        description:
            "Space-separated list of message prefixes to hide (e.g. !commands)",
    },
    {
        name: "Moderation actions",
        type: "boolean",
        value: true,
        param: "modAction",
        description:
            "Moderation actions like deletions, timeouts, bans, and clears affect chat messages",
    },
    {
        name: 'Mentions are <div id="rainbow-text">Colored</div>',
        type: "boolean",
        value: false,
        param: "mentionColor",
        description:
            "Highlight user mentions (users must have typed in chat before)",
    },
    {
        name: "7TV Paints",
        type: "boolean",
        value: true,
        param: "paints",
        description: "Enable rendering of 7TV Paints in chat",
    },
    {
        name: "7TV Paint Shadows",
        type: "boolean",
        value: true,
        param: "paintShadows",
        description:
            "Toggle shadows on 7TV Paints, may cause drops in performance",
    },
    {
        name: "Load in latest chat messages",
        type: "boolean",
        value: false,
        hide: true,
        param: "lastMsg",
        description: "Load a history of recent chat messages on connect",
    },
    {
        name: "Clear chat when going live (OBS ONLY)",
        type: "boolean",
        value: false,
        hide: true,
        param: "clearLive",
    },
];

for (const config of configs) {
    config["default"] = config["value"] as Setting["default"];
}

export const config = configs;

export const settings = writable<Setting[]>(configs.map((c) => ({ ...c })));
export const savedSettings = writable<Record<string, any>>([]);
export const channelName = writable<string>("");
export const channelID = writable<string>("");

export const settingsParams = writable<Record<string, Setting["value"]>>({});

// Initialize emote size store from default and keep it in sync with settings
setEmoteSize.set(
    (configs.find((c) => c.param === "emoteSize") as NumberSetting)?.value ??
        defaultEmoteSize,
);

settings.subscribe((list) => {
    const em = list.find((c) => c.param === "emoteSize") as
        | NumberSetting
        | undefined;
    if (em && typeof em.value === "number") setEmoteSize.set(em.value);
});
