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
import { emotes, globals, loadingInfo } from "$stores/global";
import { settings } from "$stores/settings";
import { get } from "svelte/store";
import { getLastMessages } from "./chat";

import SevenTV_main from "$lib/services/7TV/main";

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

    if (globals.userKickID) {
        await new Promise(async (resolve) => {
            const STV_USERINFO = await SevenTV_main.user.byKickID(
                globals.userKickID!,
            );

            if (!STV_USERINFO || !STV_USERINFO?.id) return resolve(true);

            if (globals.channelTwitchID) {
                const foundTwitchConnection = STV_USERINFO.connections.find(
                    (c) => c.platform == "TWITCH",
                );

                if (
                    foundTwitchConnection &&
                    foundTwitchConnection.id == globals.channelTwitchID
                ) {
                    emotes.update((e) => {
                        e["7TV"]["kick"] = "twitch";

                        return e;
                    });

                    return resolve(true);
                }
            } else {
                globals.SevenTVID = STV_USERINFO.id;
                globals.SevenTVemoteSetId = STV_USERINFO.emote_set_id;

                emotes.update((e) => {
                    e["7TV"]["kick"] = STV_USERINFO.emote_data;

                    return e;
                });

                return resolve(true);
            }
        });
    }

    const foundSetting = overlaySettings.find(
        (setting) => setting.param == "lastMsg",
    );
    if (globals.channelTwitchName && foundSetting && foundSetting.value)
        getLastMessages(globals.channelTwitchName);

    if (displayLoading) loadingInfo.set({ text: undefined, type: undefined });
}
