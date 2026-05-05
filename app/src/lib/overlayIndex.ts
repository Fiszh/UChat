import { get } from "svelte/store";

import tinycolor from "tinycolor2";

import { cosmetics } from "$stores/cosmetics";
import { badges, emotes, globals } from "$stores/global";

import { services } from "$lib/services";
import { settings, type Setting } from "$stores/settings";

let cosmetic_data = get(cosmetics);
let emote_data = get(emotes);

// SUBSCRIBE TO CHANGES
cosmetics.subscribe((data) => (cosmetic_data = data));
emotes.subscribe((data) => (emote_data = data));

// ANCHOR FUNCTIONS
export const fixNameColor = (name_color: string): string =>
    tinycolor(name_color).getBrightness() <= 50
        ? tinycolor(name_color).lighten(30).toString()
        : name_color;

export async function getVersion(): Promise<string> {
    try {
        const response_version = await fetch("/manifest.json");
        const data_version = await response_version.json();

        return data_version.version;
    } catch (err) {
        console.error(err);

        return "Unknown version";
    }
}

export async function getMainUser(channel: string | number) {
    try {
        const version = await getVersion();

        const response = await fetch(
            `https://api.unii.dev/channel?${typeof channel == "string" ? `name=` : `id=`}${channel}`,
            {
                headers: {
                    version: version,
                },
            },
        );

        if (!response.ok) {
            console.error("Fetch error:", response.status, response.statusText);
            return false;
        }

        const response_data = await response.json();

        if (
            !response_data?.channel?.data ||
            Object.keys(response_data?.channel?.data)?.length < 5
        ) {
            console.error(
                "Invalid or incomplete data structure:",
                response_data,
            );
            return false;
        }

        const channel_data = response_data.channel.data;

        const data = {
            channel_info: channel_data?.["channel_info"],
            channel_badges: channel_data?.["channel_badges"],
            channel_bits: channel_data?.["channel_cheer_emotes"],
            global_badges: channel_data?.["global_badges"],
            global_bits: channel_data?.["global_cheer_emotes"],
        };

        // CHANNEL INFO LOGIN
        globals.channelTwitchID = data?.channel_info?.id || null;
        globals.channelTwitchName = data?.channel_info?.login || null;
        const channel_color = data?.channel_info?.color || "white";

        type badge = Record<string, string>;

        // CHANNEL BADGES
        const broadcastBadges = data?.channel_badges?.broadcastBadges || [];
        try {
            const channel_subscriber_badges = broadcastBadges.filter(
                (badge: badge) => badge?.setID === "subscriber",
            );

            badges.update((badgeData) => {
                badgeData["TTV"].sub = channel_subscriber_badges.map(
                    (badge: badge) => ({
                        id: badge.version,
                        url:
                            badge.image4x ||
                            badge.image3x ||
                            badge.image2x ||
                            badge.image1x,
                        title: badge.title,
                    }),
                );

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading channel badges:", err);
        }

        try {
            const channel_bits_badges = broadcastBadges.filter(
                (badge: badge) => badge?.setID === "bits",
            );

            badges.update((badgeData) => {
                badgeData["TTV"].bit = channel_bits_badges.map(
                    (badge: badge) => ({
                        id: badge.version,
                        url:
                            badge.image4x ||
                            badge.image3x ||
                            badge.image2x ||
                            badge.image1x,
                        title: badge.title,
                    }),
                );

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading channel bits badges:", err);
        }

        // CHANNEL BITS EMOTES
        let channel_bit_emotes = [];
        try {
            const cheerGroups = data?.channel_bits?.cheer?.cheerGroups || [];
            channel_bit_emotes = cheerGroups.map(
                (group: Record<string, any>) => {
                    const node = group.nodes?.[0];
                    const prefix = node?.prefix?.toLowerCase() || "prefix";
                    const templateURL =
                        group.templateURL ||
                        "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                    return {
                        name: prefix,
                        tiers:
                            node?.tiers?.map((tier: Record<string, any>) => {
                                const replacements = {
                                    PREFIX: prefix,
                                    BACKGROUND: "dark",
                                    ANIMATION: "animated",
                                    TIER: tier?.bits || "TIER",
                                    "SCALE.EXTENSION": "4.gif",
                                } as const;

                                const tierURL = templateURL.replace(
                                    /PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g,
                                    (match: keyof typeof replacements) =>
                                        replacements[match],
                                );

                                return {
                                    min_bits: tier?.bits,
                                    url: tierURL,
                                    emote_link: tierURL,
                                    color: channel_color,
                                };
                            }) || [],
                        site: "TTV",
                    };
                },
            );
        } catch (err) {
            console.error("Error loading channel bit emotes:", err);
        }

        // GLOBAL BITS EMOTES
        let global_bit_emotes = [];
        try {
            const global_groups = data?.global_bits?.groups || [];
            const displayConfig =
                data?.global_bits?.displayConfig?.colors || [];

            global_bit_emotes =
                global_groups[0]?.nodes?.map((group: Record<string, any>) => {
                    const prefix = group?.prefix?.toLowerCase() || "prefix";
                    const templateURL =
                        global_groups[0]?.templateURL ||
                        "https://d3aqoihi2n8ty8.cloudfront.net/actions/PREFIX/BACKGROUND/ANIMATION/TIER/SCALE.EXTENSION";

                    return {
                        name: prefix,
                        tiers:
                            group?.tiers?.map((tier: Record<string, any>) => {
                                const replacements = {
                                    PREFIX: prefix,
                                    BACKGROUND: "dark",
                                    ANIMATION: "animated",
                                    TIER: tier?.bits || "TIER",
                                    "SCALE.EXTENSION": "4.gif",
                                } as const;

                                const tierURL = templateURL.replace(
                                    /PREFIX|BACKGROUND|ANIMATION|TIER|SCALE\.EXTENSION/g,
                                    (match: keyof typeof replacements) =>
                                        replacements[match],
                                );

                                return {
                                    min_bits: tier?.bits,
                                    url: tierURL,
                                    emote_link: tierURL,
                                    color:
                                        displayConfig.find(
                                            (color: Record<string, string>) =>
                                                color.bits === tier?.bits,
                                        )?.color || "white",
                                };
                            }) || [],
                        site: "TTV",
                    };
                }) || [];
        } catch (err) {
            console.error("Error loading global bit emotes:", err);
        }

        // GLOBAL BADGES
        try {
            badges.update((badgeData) => {
                badgeData["TTV"].global = (data.global_badges || []).map(
                    (badge: badge) => ({
                        id: badge.setID + "_" + badge.version,
                        url:
                            badge.image4x ||
                            badge.image3x ||
                            badge.image2x ||
                            badge.image1x,
                        title: badge.title,
                    }),
                );

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading global badges:", err);
        }

        emotes.update((emoteData) => {
            emoteData["BITS"] = [...global_bit_emotes, ...channel_bit_emotes];

            return emoteData;
        });

        // SETTINGS
        if (response_data["user_settings"]) {
            parseSavedSettings(response_data["user_settings"]);
        }

        return true;
    } catch (err) {
        return false;
    }
}

export function parseSavedSettings(saved_settings: Setting) {
    for (const [key, value] of Object.entries(saved_settings)) {
        settings.update((arr) => {
            const foundSetting = arr.find((setting) => setting.param == key);

            if (foundSetting) {
                if (!Array.isArray(value)) {
                    foundSetting.value = value as Setting["value"];
                } else {
                    foundSetting.value = value.join(" ") as Setting["value"];
                }
            }

            return arr;
        });
    }
}

export async function connectToWS() {
    services["7TV"].ws.connect();
    services["BTTV"].ws.connect();
}

export async function subscribeEventAPIToSharedChatUser(room_id: string) {
    if (room_id == globals.channelTwitchID) return;

    // BTTV
    if (emote_data["BTTV"]["channel"][room_id])
        services["BTTV"].ws.subscribe(room_id, false, true);

    // 7TV
    services["7TV"].ws.subscribe(room_id, "entitlement.create", {}, true); // PAINTS, BADGES & PERSONAL EMOTES

    const channel_set = emote_data["7TV"]["channel"][room_id];
    if (channel_set) {
        if (channel_set["id"])
            services["7TV"].ws.subscribe(
                channel_set["id"],
                "emote_set.update",
                {},
                true,
            );

        if (channel_set["user_id"])
            services["7TV"].ws.subscribe(
                channel_set["user_id"],
                "user.*",
                {},
                true,
            );
    }
}

export async function unsubscribeEventAPISharedChatUser(room_id: string) {
    if (room_id == globals.channelTwitchID) return;

    // BTTV
    services["BTTV"].ws.unsubscribe(room_id);

    // 7TV
    services["7TV"].ws.unsubscribe(room_id, "entitlement.create");

    const channel_set = emote_data["7TV"]["channel"][room_id];
    if (channel_set) {
        if (channel_set["id"])
            services["7TV"].ws.unsubscribe(
                channel_set["id"],
                "emote_set.update",
            );

        if (channel_set["user_id"])
            services["7TV"].ws.unsubscribe(channel_set["user_id"], "user.*");
    }
}

export async function cleanUpSharedChat() {
    if (!globals.inSharedChat) return;

    const room_ids_keys = [
        ...Object.keys(emote_data["7TV"]["channel"]),
        ...Object.keys(emote_data["BTTV"]["channel"]),
    ];

    if (!room_ids_keys.length) return;

    const room_ids = room_ids_keys.reduce<string[]>((arr, key) => {
        if (!arr.includes(key)) arr.push(key);

        return arr;
    }, []);

    for (const room_id of room_ids) {
        if (room_id == globals.channelTwitchID) continue;

        await unsubscribeEventAPISharedChatUser(room_id);
    }

    if (globals.channelTwitchID) {
        emotes.update((emotesData) => {
            emotesData["7TV"]["channel"] = {
                [globals.channelTwitchID as string]:
                    emotesData["7TV"]["channel"][
                        globals.channelTwitchID as string
                    ],
            };

            emotesData["BTTV"]["channel"] = {
                [globals.channelTwitchID as string]:
                    emotesData["BTTV"]["channel"][
                        globals.channelTwitchID as string
                    ],
            };

            emotesData["FFZ"]["channel"] = {
                [globals.channelTwitchID as string]:
                    emotesData["FFZ"]["channel"][
                        globals.channelTwitchID as string
                    ],
            };

            return emotesData;
        });
    }

    globals.inSharedChat = false;
}

// ANCHOR 7TV WEBSOCKET
services["7TV"].ws.on("open", () => {
    if (globals.channelTwitchID) {
        services["7TV"].ws.subscribe(
            globals.channelTwitchID,
            "entitlement.create",
        ); // 7TV account not needed to recieve cosmetic info

        if (globals.SevenTVID) {
            services["7TV"].ws.subscribe(globals.SevenTVID, "user.*"); // SET CHANGES
            if (globals.SevenTVemoteSetId)
                services["7TV"].ws.subscribe(
                    globals.SevenTVemoteSetId,
                    "emote_set.update",
                );
            // EMOTE CHANGES
        }
    }
});

const getSetKey = (set_id: string) =>
    Object.keys(emote_data["7TV"]["channel"]).find(
        (k) =>
            "id" in emote_data["7TV"]["channel"][k] &&
            emote_data["7TV"]["channel"][k].id == set_id,
    );

services["7TV"].ws.on("add_emote", (id, actor, data) => {
    if (cosmetic_data.sets[id]) {
        // PERSONAL SETS
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[id].emotes = data;

            return cosmeticsData;
        });
    } else {
        // CHANNEL SET
        const set_key = getSetKey(id);

        if (typeof set_key == "string") {
            emotes.update((emoteData) => {
                const found_set = emoteData["7TV"]["channel"][set_key];

                if ("emotes" in found_set) found_set["emotes"].push(...data);

                return emoteData;
            });
        }
    }

    //console.log("Emote added:", id, data);
});

services["7TV"].ws.on("remove_emote", (id, actor, data) => {
    const set_key = getSetKey(id);

    if (typeof set_key == "string") {
        // CHANNEL SET
        emotes.update((emoteData) => {
            const found_set = emoteData["7TV"]["channel"][set_key];

            if (found_set && "emotes" in found_set)
                found_set["emotes"] = found_set["emotes"].filter(
                    (emote) => emote.name !== data.name,
                );

            return emoteData;
        });
    }

    //console.log("Emote removed:", id, data);
});

services["7TV"].ws.on("rename_emote", (id, actor, data) => {
    const set_key = getSetKey(id);

    if (typeof set_key == "string") {
        emotes.update((emoteData) => {
            const found_set = emoteData["7TV"]["channel"][set_key];

            if (found_set && "emotes" in found_set) {
                let foundEmote = found_set["emotes"].find(
                    (emote) => emote.name === data.old.name,
                );

                if (foundEmote) foundEmote.name = data.new.name;
            }

            return emoteData;
        });
    }

    //console.log("Emote renamed:", id, data);
});

services["7TV"].ws.on("set_change", async (actor, data) => {
    // no need to resub to a new set id, already done via the websocket client
    const newSet = await services["7TV"].main.emoteSet.bySetID(data.new_set.id);

    const set_key = getSetKey(data.old_set.id);

    if (typeof set_key == "string") {
        emotes.update((emoteData) => {
            const channelSets = emoteData["7TV"]["channel"];

            if (typeof set_key == "string") {
                channelSets[set_key] = {
                    ...channelSets[set_key],
                    id: data.new_set.id,
                    emotes: newSet,
                } as SavedSevenTVSet;
            }

            return emoteData;
        });
    }

    //console.log("Emote set changed:", data);
});

services["7TV"].ws.on("create_badge", (data) => {
    if (!cosmetic_data.badges[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.badges[data.id] = data;

            return cosmeticsData;
        });
    }
});

services["7TV"].ws.on("create_paint", (data) => {
    if (!cosmetic_data.paints[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.paints[data.id] = data;

            return cosmeticsData;
        });
    }
});

services["7TV"].ws.on("create_personal_set", (data) => {
    // CREATE PERSONAL SET
    if (!cosmetic_data.sets[data.id]) {
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[data.id] = {
                id: data.id,
                name: data.name,
                flags: data.flags,
                owner: data?.flags == 4 ? [data.owner] : [],
                emotes: [],
            };

            return cosmeticsData;
        });
    }
});

// PERSONAL SETS SHOULD NOT REMOVE THE OWNER, RIGHT 7TV?
services["7TV"].ws.on("create_entitlement", (data) => {
    // BIND A BADGE, PAINT OR SET TO A USER
    if (
        cosmetic_data.sets[data.id] &&
        cosmetic_data.sets[data.id]?.flags != 4
    ) {
        // SET
        cosmetics.update((cosmeticsData) => {
            cosmeticsData.sets[data.id].owner.push(data.owner);

            return cosmeticsData;
        });
    } else if (cosmetic_data.badges[data.id]) {
        // BADGE
        cosmetics.update((cosmeticsData) => {
            for (const badge of Object.values(cosmeticsData.badges)) {
                // REMOVE BADGE OWNER
                badge.owner = badge.owner.filter(
                    (o) => o.id !== String(data?.owner.id),
                );
            }

            cosmeticsData.badges[data.id].owner.push(data.owner);

            return cosmeticsData;
        });
    } else if (cosmetic_data.paints[data.id]) {
        // PAINT
        cosmetics.update((cosmeticsData) => {
            for (const paint of Object.values(cosmeticsData.paints)) {
                // REMOVE PAINT OWNER
                paint.owner = paint.owner.filter(
                    (o) => o.id !== String(data?.owner.id),
                );
            }

            cosmeticsData.paints[data.id].owner.push(data.owner);

            return cosmeticsData;
        });
    }

    //console.log("Created entitlement:", data);
});

services["7TV"].ws.on("delete_entitlement", (data) => {
    let whatToDelete: "badges" | "paints" | undefined;

    if (cosmetic_data.badges[data.id]) {
        // BADGE
        whatToDelete = "badges";
    } else if (cosmetic_data.paints[data.id]) {
        // PAINT
        whatToDelete = "paints";
    }

    cosmetics.update((cosmeticsData) => {
        if (typeof whatToDelete == "string") {
            for (const entitlement of Object.values(
                cosmeticsData[whatToDelete],
            ) as Record<string, any>[]) {
                entitlement.owner = entitlement.owner.filter(
                    (o: Record<string, string>) =>
                        o.id !== String(data?.owner.id),
                );
            }
        }

        return cosmeticsData;
    });

    //console.log("Deleted entitlement:", data);
});

// ANCHOR BTTV WEBSOCKET
services["BTTV"].ws.on("open", () => {
    if (
        globals.channelTwitchID &&
        emote_data["BTTV"].channel[globals.channelTwitchID]?.length
    ) {
        services["BTTV"].ws.subscribe(globals.channelTwitchID); // SET CHANGES
    }
});

services["BTTV"].ws.on("add_emote", (id, data) => {
    if (id && emote_data["BTTV"]["channel"][id]) {
        emotes.update((emoteData) => {
            const found_set = emoteData["BTTV"]["channel"][id];

            found_set.push(data);

            return emoteData;
        });
    }

    //console.log("Emote added:", id, data);
});

services["BTTV"].ws.on("remove_emote", (id, data) => {
    if (id && emote_data["BTTV"]["channel"][id]) {
        emotes.update((emoteData) => {
            emoteData["BTTV"]["channel"][id] = emoteData["BTTV"]["channel"][
                id
            ].filter((emote: ParsedEmote) => emote.emote_id !== data); // REMOVE EMOTE FROM SET

            return emoteData;
        });
    }

    //console.log("Emote removed:", id, data);
});

services["BTTV"].ws.on("rename_emote", (id, data) => {
    if (id && emote_data["BTTV"]["channel"][id]) {
        emotes.update((emoteData) => {
            const found_set = emoteData["BTTV"]["channel"][id];
            const found_emote = found_set.find(
                (emote: ParsedEmote) => emote.emote_id == data.id,
            );

            if (found_emote) found_emote.name = data.code;

            return emoteData;
        });
    }

    //console.log("Emote renamed:", id, data);
});
