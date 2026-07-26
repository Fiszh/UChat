import {
    getBTTVBadges,
    getChatterinoBadges,
    getChatterinoHomiesBadges,
    getCustomChatterinoHomiesBadges,
    getFFZBadges,
    getMainBadges,
    getPolandBOTBadges,
    getTurtegBotBadges,
} from "$lib/badges/main";
import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes/main";
import { emotes, globals, loadingInfo } from "$stores/global";
import { settings } from "$stores/settings";
import { get } from "svelte/store";
import { getLastMessages } from "./chat";
import { services } from "./services";
import { getSavedSet } from "./overlayIndex";

export const initBadges = async () =>
    await Promise.allSettled([
        // BADGES
        getMainBadges(),

        // OTHER BADGES
        getBTTVBadges(),
        getFFZBadges(),
        getChatterinoBadges(),
        getChatterinoHomiesBadges(),
        getCustomChatterinoHomiesBadges(),
        getPolandBOTBadges(),
        getTurtegBotBadges(),
    ]);

export async function initChat() {
    return await Promise.allSettled([
        // BADGES
        initBadges(),

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

    if (globals.userKickID) {
        const alreadyHasSet = getSavedSet(globals.userKickID, "KICK");

        if (!alreadyHasSet) {
            const stv_user = await services["7TV"].main.user.byKickID(
                globals.userKickID,
            );

            console.log(stv_user);

            if (stv_user["id"]) {
                emotes.update((emoteData) => {
                    emoteData["7TV"]["channel"] = [
                        ...emoteData["7TV"]["channel"],
                        {
                            id: stv_user.emote_set_id,
                            owners: stv_user.connections,
                            emotes: stv_user.emote_data,
                        },
                    ];

                    return emoteData;
                });
            }
        }
    }

    const foundSetting = overlaySettings.find(
        (setting) => setting.param == "lastMsg",
    );
    if (globals.channelTwitchName && foundSetting && foundSetting.value)
        getLastMessages(globals.channelTwitchName);

    if (displayLoading) loadingInfo.set({ text: undefined, type: undefined });
}
