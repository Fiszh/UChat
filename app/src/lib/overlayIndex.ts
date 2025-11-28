import { get } from "svelte/store";

import { cosmetics } from "$stores/cosmetics";
import { badges, emotes, globals } from '$stores/global';

import SevenTV_main from '$lib/services/7TV/main';
import SevenTV_ws from '$lib/services/7TV/websocket';

import BTTV_main from '$lib/services/BTTV/main';
import BTTV_ws from '$lib/services/BTTV/websocket';

import FFZ_main from '$lib/services/FFZ/main';

// ANCHOR FUNCTIONS
export async function getMainUser(channel: string | number) {
    try {
        const response = await fetch(`https://api.unii.dev/channel?${typeof channel == "string" ? `name=` : `id=`}${channel}`);

        if (!response.ok) {
            console.error("Fetch error:", response.status, response.statusText);
            return false;
        }

        const response_data = await response.json();

        if (!response_data?.channel?.data || Object.keys(response_data?.channel?.data)?.length < 5) {
            console.error("Invalid or incomplete data structure:", response_data);
            return false;
        }

        const channel_data = response_data.channel.data;

        const data = {
            channel_info: channel_data?.["channel_info"],
            channel_badges: channel_data?.["channel_badges"],
            channel_bits: channel_data?.["channel_cheer_emotes"],
            global_badges: channel_data?.["global_badges"],
            global_bits: channel_data?.["global_cheer_emotes"]
        };

        // CHANNEL INFO LOGIN
        globals.channelTwitchID = data?.channel_info?.id || null;
        globals.channelTwitchName = data?.channel_info?.login || null;
        const channel_color = data?.channel_info?.color || "white";

        type badge = Record<string, string>;

        // CHANNEL BADGES
        const broadcastBadges = data?.channel_badges?.broadcastBadges || [];
        try {
            const channel_subscriber_badges = broadcastBadges.filter((badge: badge) => badge?.setID === "subscriber");

            badges.update((badgeData) => {
                badgeData["TTV"].sub = channel_subscriber_badges.map((badge: badge) => ({
                    id: badge.version,
                    url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                    title: badge.title
                }));

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading channel badges:", err);
        }

        try {
            const channel_bits_badges = broadcastBadges.filter((badge: badge) => badge?.setID === "bits");

            badges.update((badgeData) => {
                badgeData["TTV"].bit = channel_bits_badges.map((badge: badge) => ({
                    id: badge.version,
                    url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                    title: badge.title
                }));

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading channel bits badges:", err);
        }

        // CHANNEL BITS EMOTES
        let channel_bit_emotes = [];
        try {
            const cheerGroups = data?.channel_bits?.cheer?.cheerGroups || [];
            channel_bit_emotes = cheerGroups.map((group: Record<string, any>) => {
                const node = group.nodes?.[0];
                const prefix = node?.prefix?.toLowerCase() || "prefix";
                const templateURL = group.templateURL || "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                return {
                    name: prefix,
                    tiers: node?.tiers?.map((tier: Record<string, any>) => {
                        const replacements = {
                            PREFIX: prefix,
                            BACKGROUND: "dark",
                            ANIMATION: "animated",
                            TIER: tier?.bits || "TIER",
                            "SCALE.EXTENSION": "4.gif"
                        } as const;

                        const tierURL = templateURL.replace(
                            /PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g,
                            (match: keyof typeof replacements) => replacements[match]
                        );

                        return {
                            min_bits: tier?.bits,
                            url: tierURL,
                            emote_link: tierURL,
                            color: channel_color
                        };
                    }) || [],
                    site: 'TTV'
                };
            });
        } catch (err) {
            console.error("Error loading channel bit emotes:", err);
        }

        // GLOBAL BITS EMOTES
        let global_bit_emotes = [];
        try {
            const global_groups = data?.global_bits?.groups || [];
            const displayConfig = data?.global_bits?.displayConfig?.colors || [];

            global_bit_emotes = global_groups[0]?.nodes?.map((group: Record<string, any>) => {
                const prefix = group?.prefix?.toLowerCase() || "prefix";
                const templateURL = global_groups[0]?.templateURL || "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                return {
                    name: prefix,
                    tiers: group?.tiers?.map((tier: Record<string, any>) => {
                        const replacements = {
                            PREFIX: prefix,
                            BACKGROUND: "dark",
                            ANIMATION: "animated",
                            TIER: tier?.bits || "TIER",
                            "SCALE.EXTENSION": "4.gif"
                        } as const;

                        const tierURL = templateURL.replace(
                            /PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g,
                            (match: keyof typeof replacements) => replacements[match]
                        );

                        return {
                            min_bits: tier?.bits,
                            url: tierURL,
                            emote_link: tierURL,
                            color: displayConfig.find((color: Record<string, string>) => color.bits === tier?.bits)?.color || "white"
                        };
                    }) || [],
                    site: 'TTV'
                };
            }) || [];
        } catch (err) {
            console.error("Error loading global bit emotes:", err);
        }

        // GLOBAL BADGES
        try {
            badges.update((badgeData) => {
                badgeData["TTV"].global = (data.global_badges || []).map((badge: badge) => ({
                    id: badge.setID + "_" + badge.version,
                    url: badge.image4x || badge.image3x || badge.image2x || badge.image1x,
                    title: badge.title
                }));

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading global badges:", err);
        }

        emotes.update((emoteData) => {
            emoteData["BITS"] = [...global_bit_emotes, ...channel_bit_emotes];

            return emoteData;
        });

        // TODO: SETTINGS

        return true;
    } catch (err) {
        return false;
    }
}

export async function connectToWS() {
    services["7TV"].ws.connect();
    services["BTTV"].ws.connect();
}

// ANCHOR WEBSOCKETS
const services = {
    "7TV": {
        "main": SevenTV_main,
        "ws": new SevenTV_ws({ reconnect: true }),
    },
    "BTTV": {
        "main": BTTV_main,
        "ws": new BTTV_ws({ reconnect: true }),
    },
    "FFZ": {
        "main": FFZ_main,
    },
};

// YES I WILL LATER REWRITE IT SO THERE IS JUST ONE UPDATE DETECTOR INSTEAD OF GET FOR EACH FUCNTION // FIXME: REWRITE THIS :3
// ANCHOR 7TV WEBSOCKET
services["7TV"].ws.on("open", () => {
    if (globals.channelTwitchID) {
        services["7TV"].ws.subscribe(globals.channelTwitchID, "entitlement.create"); // 7TV account not needed to recieve cosmetic info

        if (globals.SevenTVID) {
            services["7TV"].ws.subscribe(globals.SevenTVID, "user.*"); // SET CHANGES
            if (globals.SevenTVemoteSetId) { services["7TV"].ws.subscribe(globals.SevenTVemoteSetId, "emote_set.update"); }; // EMOTE CHANGES
        }
    }
})

services["7TV"].ws.on("add_emote", (id, actor, data) => {
    const cosmetic_data = get(cosmetics);

    if (cosmetic_data.sets[id]) { // PERSONAL SETS
        data.set = "7TV Personal";

        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[id].emotes.push(data);

            return cosmeticsData;
        })
    } else if (globals.SevenTVemoteSetId == id && globals.channelTwitchID) { // CHANNEL SET
        emotes.update((emoteData) => {
            emoteData["7TV"]["channel"][globals.channelTwitchID || ""].push(data);

            return emoteData;
        });
    }

    console.log("Emote added:", id, data);
});

services["7TV"].ws.on("remove_emote", (id, actor, data) => {
    const cosmetic_data = get(cosmetics);

    if (cosmetic_data.sets[id]) { // PERSONAL SETS
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[id].emotes = cosmeticsData.sets[id].emotes.filter((emote: ParsedEmote) => emote.url !== data.url);

            return cosmeticsData;
        })
    } else if (globals.SevenTVemoteSetId == id && globals.channelTwitchID) {// CHANNEL SET
        emotes.update((emoteData) => {
            emoteData["7TV"]["channel"][globals.channelTwitchID || ""] = emoteData["7TV"]["channel"][globals.channelTwitchID || ""].filter(emote => emote.url !== data.url);

            return emoteData;
        });
    }

    console.log("Emote removed:", id, data);
});

services["7TV"].ws.on("rename_emote", (id, actor, data) => {
    if (globals.SevenTVemoteSetId == id && globals.channelTwitchID) {
        emotes.update((emoteData) => {
            const found_set = emoteData["7TV"]["channel"][globals.channelTwitchID || ""];
            let foundEmote = found_set.find(emote => emote.emote_id === (data.old.id || data.new.id));

            if (foundEmote) {
                foundEmote.name = data.new.name;
            }

            return emoteData;
        });
    }

    console.log("Emote renamed:", id, data);
});

services["7TV"].ws.on("set_change", async (actor, data) => { // no need to resub to a new set id, already done via the websocket client
    if (globals.channelTwitchID) {
        const newSet = await services["7TV"].main.emoteSet.bySetID(data.new_set.id);

        emotes.update((emoteData) => {
            emoteData['7TV']['channel'][globals.channelTwitchID || ""] = newSet;

            return emoteData;
        });
    }

    console.log("Emote set changed:", data);
});

services["7TV"].ws.on("create_badge", (data) => {
    const cosmetic_data = get(cosmetics);

    if (!cosmetic_data.badges[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.badges[data.id] = data;

            return cosmeticsData;
        })
    }
});

services["7TV"].ws.on("create_paint", (data) => {
    const cosmetic_data = get(cosmetics);

    if (!cosmetic_data.paints[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.paints[data.id] = data;

            return cosmeticsData;
        })
    }
});

services["7TV"].ws.on("create_personal_set", (data) => { // CREATE PERSONAL SET
    const cosmetic_data = get(cosmetics);

    if (!cosmetic_data.sets[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[data.id] = {
                id: data.id,
                name: data.name,
                flags: data.flags,
                owner: data?.flags == 4 ? [data.owner] : [],
                emotes: []
            };

            return cosmeticsData;
        })
    }
});

// PERSONAL SETS SHOULD NOT REMOVE THE OWNER, RIGHT 7TV?
services["7TV"].ws.on("create_entitlement", (data) => { // BIND A BADGE, PAINT OR SET TO A USER
    const cosmetic_data = get(cosmetics);

    if (cosmetic_data.sets[data.id] && cosmetic_data.sets[data.id]?.flags != 4) { // SET
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[data.id].owner.push(data.owner);

            return cosmeticsData;
        })
    } else if (cosmetic_data.badges[data.id]) { // BADGE
        cosmetics.update((cosmeticsData) => {
            for (const badge of Object.values(cosmeticsData.badges)) { // REMOVE BADGE OWNER
                badge.owner = badge.owner.filter(o => o.id !== String(data?.owner.id));
            }

            cosmeticsData.badges[data.id].owner.push(data.owner);

            return cosmeticsData;
        })
    } else if (cosmetic_data.paints[data.id]) { // PAINT
        cosmetics.update((cosmeticsData) => {
            for (const paint of Object.values(cosmeticsData.paints)) { // REMOVE PAINT OWNER
                paint.owner = paint.owner.filter(o => o.id !== String(data?.owner.id));
            }

            cosmeticsData.paints[data.id].owner.push(data.owner);

            return cosmeticsData;
        })
    }

    console.log("Created entitlement:", data);
});

services["7TV"].ws.on("delete_entitlement", (data) => {
    const cosmetic_data = get(cosmetics);

    let whatToDelete: string;

    if (cosmetic_data.badges[data.id]) { // BADGE
        whatToDelete = "badges";
    } else if (cosmetic_data.paints[data.id]) { // PAINT
        whatToDelete = "paints";
    }

    cosmetics.update((cosmeticsData) => {
        if (whatToDelete == "badges" || whatToDelete == "paints") {
            for (const entitlement of Object.values(cosmeticsData[whatToDelete]) as Record<string, any>[]) {
                entitlement.owner = entitlement.owner.filter((o: Record<string, string>) => o.id !== String(data?.owner.id));
            }
        }

        return cosmeticsData;
    })

    console.log("Deleted entitlement:", data);
});

// ANCHOR BTTV WEBSOCKET
services["BTTV"].ws.on("open", () => {
    const emote_data = get(emotes);

    if (globals.channelTwitchID && emote_data["BTTV"].channel[globals.channelTwitchID]?.length) {
        services['BTTV'].ws.subscribe(globals.channelTwitchID); // SET CHANGES
    }
})

services["BTTV"].ws.on("add_emote", (id, data) => {
    const emote_data = get(emotes);

    if (id == globals.channelTwitchID && emote_data["BTTV"]["channel"][globals.channelTwitchID]) {
        emotes.update((emoteData) => {
            const found_set = emoteData["BTTV"]["channel"][globals.channelTwitchID || ""];

            found_set.push(data);

            return emoteData;
        });
    }

    console.log("Emote added:", id, data);
});

services["BTTV"].ws.on("remove_emote", (id, data) => {
    const emote_data = get(emotes);

    if (id == globals.channelTwitchID && emote_data["BTTV"]["channel"][globals.channelTwitchID]) {
        emotes.update((emoteData) => {
            emoteData["BTTV"]["channel"][globals.channelTwitchID || ""] = emoteData["BTTV"]["channel"][globals.channelTwitchID || ""].filter((emote: ParsedEmote) => emote.emote_id !== data); // REMOVE EMOTE FROM SET

            return emoteData;
        });
    }

    console.log("Emote removed:", id, data);
});

services["BTTV"].ws.on("rename_emote", (id, data) => {
    const emote_data = get(emotes);

    if (id == globals.channelTwitchID && emote_data["BTTV"]["channel"][globals.channelTwitchID]) {
        emotes.update((emoteData) => {
            const found_set = emoteData["BTTV"]["channel"][globals.channelTwitchID || ""];
            const found_emote = found_set.find((emote: ParsedEmote) => emote.emote_id == data.id);

            if (found_emote) {
                found_emote.name = data.code;
            }

            return emoteData;
        });
    }

    console.log("Emote renamed:", id, data);
});