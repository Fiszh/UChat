import { getBTTVBadges, getChatterinoBadges, getChatterinoHomiesBadges, getFFZBadges, getMainBadges } from "$lib/badges";
import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";
import { globals, loadingInfo } from "$stores/global";
import { settings, settingsParams } from "$stores/settings";
import { get } from "svelte/store";
import { getLastMessages } from "./chat";

export async function loadChat(displayLoading?: boolean) {
    if (displayLoading) { loadingInfo.set({ text: undefined, type: "minimal" }); };

    const overlaySettings = get(settings);
    console.log(overlaySettings);

    await getMainBadges();
    await getBTTVBadges();
    await getFFZBadges();
    await getChatterinoBadges();
    await getChatterinoHomiesBadges();

    await getGlobalEmotes();
    if (globals.channelTwitchID) await getChannelEmotesViaTwitchID(globals.channelTwitchID);

    const foundSetting = overlaySettings.find(setting => setting.param == "lastMsg");
    if (globals.channelTwitchName && foundSetting && foundSetting.value) getLastMessages(globals.channelTwitchName);

    if (displayLoading) loadingInfo.set({ text: undefined, type: undefined });
}