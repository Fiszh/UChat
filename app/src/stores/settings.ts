import { writable } from 'svelte/store';

export interface Setting {
    name: string;
    type: "number" | "text" | "boolean" | "color-picker";
    value: string | boolean | number;
    param: string;
    default?: Setting["value"];
    list?: boolean;
}

const configs: Setting[] = [
    {
        "name": "Message are in <strong>bold</strong> text",
        "type": "boolean",
        "value": true,
        "param": "msgBold"
    },
    {
        "name": "Message are in UPPERCASE",
        "type": "boolean",
        "value": false,
        "param": "msgCaps"
    },
    {
        "name": "Custom chat font (hex)",
        "type": "text",
        "value": "FFFFFF",
        "param": "fontColor"
    },
    {
        "name": "Chat font color",
        "type": "text",
        "value": "inter",
        "param": "font"
    },
    {
        "name": "Font & Badge size (px)",
        "type": "number",
        "param": "fontSize",
        "value": 20
    },
    {
        "name": "Font stroke",
        "type": "boolean",
        "value": false,
        "param": "fontStroke"
    },
    {
        "name": "Message shadow (0-10)",
        "type": "number",
        "param": "fontShadow",
        "value": 4
    },
    {
        "name": "Emote size (px)",
        "type": "number",
        "param": "emoteSize",
        "value": 25
    },
    {
        "name": "Text fade out (seconds)",
        "type": "number",
        "param": "fadeOut",
        "value": 0
    },
    {
        "name": "Display badges",
        "type": "boolean",
        "value": true,
        "param": "badges"
    },
    {
        "name": "Display channel points redeem, sub messages, annoucements... (Redeems & USERNOTICES)",
        "type": "boolean",
        "value": true,
        "param": "redeem"
    },
    {
        "name": "Display bots in chat (Based on FFZ & Twitch bot badges)",
        "type": "boolean",
        "value": true,
        "param": "bots"
    },
    {
        "name": "Custom user blacklist (separate using spaces)",
        "type": "text",
        "value": "",
        "param": "userBL",
        "list": true
    },
    {
        "name": "Custom prefix blacklist (separate using spaces)",
        "type": "text",
        "value": "",
        "param": "prefixBL",
        "list": true
    },
    {
        "name": "Moderation actions effect displayed chat messages (message deletion)",
        "type": "boolean",
        "value": true,
        "param": "modAction"
    },
    {
        "name": "Mentions are <div id=\"rainbow-text\">Colored</div>",
        "type": "boolean",
        "value": false,
        "param": "mentionColor"
    },
    {
        "name": "Display 7TV Paints",
        "type": "boolean",
        "value": true,
        "param": "paints"
    },
    {
        "name": "Display 7TV Paint Shadows (may cause drops in performance)",
        "type": "boolean",
        "value": true,
        "param": "paintShadows"
    }
]

for (const config of configs) {
    config["default"] = config["value"] as Setting["default"];
}

export const config = configs;

export let settings = writable<Setting[]>(configs.map(c => ({ ...c })));
export let savedSettings = writable<Record<string, any>>([]);
export let channelName = writable<String>("");
export let channelID = writable<String>("");

export let overlayVersion = writable<String>("");

export let settingsParams = writable<Record<string, Setting["value"]>>({});