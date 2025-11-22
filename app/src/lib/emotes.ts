import { globals } from '$stores/global';

import SevenTV_main from '$lib/services/7TV/main';
import BTTV_main from '$lib//services/BTTV/main';
import FFZ_main from '$lib//services/FFZ/main';

let processing_ids: string[] = [];
export async function getChannelEmotesViaTwitchID(twitchID: string) {
    if (!twitchID || twitchID === "0" || processing_ids.includes(twitchID)) { return; };

    processing_ids.push(twitchID); // prevent API spam

    // 7TV
    try {
        if (!globals.emotes["7TV"]["channel"][twitchID]) {
            const SevenTV_user_data = await SevenTV_main.getUserViaTwitchID(twitchID);

            globals.emotes["7TV"]["channel"][twitchID] = SevenTV_user_data?.emote_data as ParsedEmote[];

            if (SevenTV_user_data?.id) {
                globals.SevenTVID = SevenTV_user_data.id;
            };

            if (SevenTV_user_data?.emote_set_id) {
                globals.SevenTVemoteSetId = SevenTV_user_data.emote_set_id;
            };
        }
    } catch (e) {
        console.error(`7TV error for ${twitchID}:`, e);
    }

    // BTTV
    try {
        if (!globals.emotes["BTTV"]["channel"][twitchID]) {
            globals.emotes["BTTV"]["channel"][twitchID] = await BTTV_main.getEmoteData(twitchID);
        }
    } catch (e) {
        console.error(`BTTV error for ${twitchID}:`, e);
    }

    // FFZ
    try {
        if (!globals.emotes["FFZ"]["channel"][twitchID]) {
            const ffzData = await FFZ_main.getUserData(twitchID);
            globals.emotes["FFZ"]["channel"][twitchID] = ffzData?.set || [];
        }
    } catch (e) {
        console.error(`FFZ error for ${twitchID}:`, e);
    }

    // CHANNEL BADGE
    try {
        if (!globals.badges.channel[twitchID]) {
            const avatar = await getAvatarViaID(twitchID);
            if (avatar) { globals.badges.channel[twitchID] = avatar; };
        }
    } catch (e) {
        console.error(`Badge error for ${twitchID}:`, e);
    }

    // remove from processing
    processing_ids = processing_ids.filter(id => id !== twitchID);
}

async function getAvatarViaID(user_id: string) {
    const response = await fetch(`https://api.unii.dev/avatar?id=${user_id}`);

    if (!response.ok) {
        return false;
    }

    const data = await response.json();

    return data?.avatar || false;
}

export async function getGlobalEmotes() {
    globals.emotes["7TV"].global = await SevenTV_main.emoteSet.bySetID("global");
    globals.emotes["BTTV"].global = await BTTV_main.getGlobalEmoteSet();
    globals.emotes["FFZ"].global = await FFZ_main.getGlobalEmotes();
}