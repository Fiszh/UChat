import { writable } from "svelte/store";
import { settings } from "$stores/settings";
import { YTNodes } from "youtubei.js";

let clearChatWhenGoingLive = false;

settings.subscribe((cfg) => {
    const foundSetting = cfg.find(
        (setting) => setting.param == "clearLive",
    ) || {
        value: false,
    };

    clearChatWhenGoingLive =
        typeof foundSetting.value == "boolean" ? foundSetting.value : false;
});

export type ChatMessage =
    | Record<string, any>
    | (YTNodes.LiveChatTextMessage & {
          service: "GOOGLE";
          removed?: boolean;
      });

export const messages = writable<ChatMessage[]>([]);

export function clearChat(obs?: boolean) {
    if (obs && clearChatWhenGoingLive) return messages.set([]);
    return messages.set([]);
}

export const sanitizeInput = (input: string) =>
    typeof input !== "string"
        ? input
        : input
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;")
              .replace(/\//g, "&#x2F;");
