import {
    getBTTVBadges,
    getChatterinoBadges,
    getChatterinoHomiesBadges,
    getFFZBadges,
    getMainBadges,
    getPolandBOTBadges,
    getTurtegBotBadges,
} from "$lib/badges";
import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";
import { globals, loadingInfo } from "$stores/global";
import { settings } from "$stores/settings";
import { get } from "svelte/store";
import { getLastMessages } from "./chat";

export async function initChat() {
    return await Promise.allSettled([
        getMainBadges(),

        // OTHER BADGES
        getBTTVBadges(),
        getFFZBadges(),
        getChatterinoBadges(),
        getChatterinoHomiesBadges(),
        getPolandBOTBadges(),
        getTurtegBotBadges(),

        // EMOTES
        getGlobalEmotes(),
    ]);
}

export async function loadChat(displayLoading?: boolean) {
    if (displayLoading) loadingInfo.set({ text: undefined, type: "minimal" });

    const overlaySettings = get(settings);
    console.log(overlaySettings);

    await initChat();

    if (globals.channelTwitchID)
        await getChannelEmotesViaTwitchID(globals.channelTwitchID);

    const foundSetting = overlaySettings.find(
        (setting) => setting.param == "lastMsg",
    );
    if (globals.channelTwitchName && foundSetting && foundSetting.value)
        getLastMessages(globals.channelTwitchName);

    if (displayLoading) loadingInfo.set({ text: undefined, type: undefined });
}
