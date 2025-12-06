import { getBTTVBadges, getChatterinoBadges, getChatterinoHomiesBadges, getFFZBadges, getMainBadges } from "$lib/badges";
import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";
import { globals, loadingInfo } from "$stores/global";

export async function loadChat(displayLoading?: boolean) {
    if (displayLoading) { loadingInfo.set({ text: undefined, type: "minimal" }); };

    await getMainBadges();
    await getBTTVBadges();
    await getFFZBadges();
    await getChatterinoBadges();
    await getChatterinoHomiesBadges();

    await getGlobalEmotes();
    if (globals.channelTwitchID) {
        await getChannelEmotesViaTwitchID(globals.channelTwitchID);

    }

    if (displayLoading) { loadingInfo.set({ text: undefined, type: undefined }); };
}