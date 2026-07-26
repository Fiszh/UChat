import { logos } from "$components/logos.svelte";
import { flags } from "$lib/bitmap";
import type { Snippet } from "svelte";
import { writable } from "svelte/store";

export interface DefaultSetting {
    name: string;
    param: string;
    description?: string;
    hide?: boolean;
    previewReact?: boolean;
}

export interface NumberSetting extends DefaultSetting {
    type: "number";
    value: string;
    default?: string;
}

export interface TextSetting extends DefaultSetting {
    type: "text";
    value: string;
    default?: string;
    list?: boolean;
}

export interface BooleanSetting extends DefaultSetting {
    type: "boolean";
    value: boolean;
    default?: boolean;
}

export interface ColorPickerSetting extends DefaultSetting {
    type: "color-picker";
    value: string;
    default?: string;
}

export interface SliderSetting extends DefaultSetting {
    type: "slider";
    value: string;
    min: string;
    max: string;
    default?: string;
}

export interface SelectorSetting extends DefaultSetting {
    type: "selector";
    value: number;
    default?: number;
    selectors: {
        enabled: boolean;
        label?: string;
        icon?: Snippet<[boolean]>;
        bitmap: number;
        disabled?: boolean;
    }[];
}

export type Setting =
    | NumberSetting
    | TextSetting
    | BooleanSetting
    | ColorPickerSetting
    | SliderSetting
    | SelectorSetting;

const defaultEmoteSize = "25";

export const setEmoteSize = writable<string>(defaultEmoteSize);

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
        value: "20",
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
        name: "Message shadow",
        type: "slider",
        param: "fontShadow",
        value: "10",
        min: "0",
        max: "10",
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
        value: "0",
        previewReact: false,
        description:
            "Automatically fade out messages after the specified number of seconds",
    },
    {
        name: "Badges",
        type: "selector",
        value: 0,
        selectors: [
            {
                label: "UChat",
                enabled: true,
                icon: logos["uchat"],
                bitmap: 1 << 0,
            },
            {
                label: "Twitch",
                enabled: true,
                icon: logos["twitch"],
                bitmap: 1 << 1,
            },
            {
                label: "Kick",
                enabled: true,
                icon: logos["kick"],
                bitmap: 1 << 2,
            },
            { label: "7TV", enabled: true, icon: logos["7tv"], bitmap: 1 << 3 },
            {
                label: "BTTV",
                enabled: true,
                icon: logos["bttv"],
                bitmap: 1 << 4,
            },
            { label: "FFZ", enabled: true, icon: logos["ffz"], bitmap: 1 << 5 },
            {
                label: "Chatterino",
                enabled: true,
                icon: logos["chatterino"],
                bitmap: 1 << 6,
            },
            {
                label: "Homies",
                enabled: false,
                icon: logos["chatterino-homies"],
                bitmap: 1 << 7,
            },
            {
                label: "PolandBOT",
                enabled: true,
                icon: logos["polandbot"],
                bitmap: 1 << 8,
            },
            {
                label: "Turteg",
                enabled: true,
                icon: logos["turteg"],
                bitmap: 1 << 9,
            },
        ],
        param: "badges",
        description: "Choose which badges to show in chat",
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
        name: 'Mentions are <div class="rainbow-text">Colored</div>',
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
        description: "Clear the chat automatically when the channel goes live",
    },
];

for (const config of configs) {
    if (config["type"] == "selector")
        config["value"] = flags.getDefault(config["selectors"]);

    config["default"] = config["value"] as Setting["default"];
}

export const config = configs;

export const settings = writable<Setting[]>(configs.map((c) => ({ ...c })));
export const savedSettings = writable<Record<string, any>>([]);
export const channelID = writable<string>("");

export const settingsParams = writable<Record<string, Setting["value"]>>({});

type ChatSettings = Record<string, Setting["value"]>;
export let chatSettings: ChatSettings = {};

settings.subscribe((cfg) => {
    for (const setting of cfg) {
        chatSettings[setting.param] = setting.value;
    }
});
