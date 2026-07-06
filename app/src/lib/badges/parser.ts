import { get } from "svelte/store";

import { getBadge } from "$lib/services/7TV/cosmetics";

import { badges } from "$stores/global";

import { settings } from "$stores/settings";

let BadgesData = get(badges);
badges.subscribe((e: any) => (BadgesData = e));

let onlyTwitchBadges = false;

settings.subscribe((cfg) => {
    const foundSetting = cfg.find(
        (setting) => setting.param == "badgesTTV",
    ) || {
        value: false,
    };

    if (typeof foundSetting.value == "boolean")
        onlyTwitchBadges = foundSetting.value;
});

interface MessageInfo {
    username: string;
    user_id: string;
    room_id?: string;
}

export function parseBadges(
    userstate: Record<string, any>,
    messageInfo?: MessageInfo,
): parsedBadge[] {
    const user_badges: parsedBadge[] = [];

    // SHARED CHAT BADGE
    const foundAvatarBadge =
        BadgesData["channel"]?.[userstate["source-room-id"]];

    if (foundAvatarBadge) {
        user_badges.push({
            badge_url: foundAvatarBadge,
            alt: "Shared Chat",
            background_color: undefined,
        });
    }

    // SHARED CHAT BADGE
    const foundUChatBadges = BadgesData["UChat"].filter((badge) =>
        badge.users.includes(
            userstate["user-id-raw"] ?? messageInfo?.["user_id"],
        ),
    );

    foundUChatBadges.forEach((foundUChatBadge) => {
        user_badges.push({
            badge_url: foundUChatBadge.urls["4x"],
            alt: foundUChatBadge.id,
            background_color: undefined,
        });
    });

    // THIS NEEDS TO BE ALWAYS ON THE START TO MAKE SURE TWITCH BADGES WILL BE FIRST
    if (
        userstate["badges-raw"] &&
        Object.keys(userstate["badges-raw"]).length
    ) {
        const rawBadges = userstate["badges-raw"];
        const badgesSplit = rawBadges.split(",");

        for (const Badge of badgesSplit) {
            const badgeSplit = Badge.split("/");

            if (BadgesData["TTV"].channel) {
                const badge = BadgesData["TTV"].channel.find(
                    (badge) => badge.id === `${badgeSplit[0]}_${badgeSplit[1]}`,
                );

                if (badge) {
                    user_badges.push({
                        badge_url: badge.url,
                        alt: badge.title,
                        background_color: undefined,
                    });

                    continue;
                }
            }

            // SEARCH IN GLOBAL IF NO CHANNEL BADGE FOUND
            const badge = BadgesData["TTV"].global.find(
                (badge) => badge.id === `${badgeSplit[0]}_${badgeSplit[1]}`,
            );

            if (badge && badge.id) {
                if (
                    badge.id === "moderator_1" &&
                    BadgesData["FFZ"]["user"]["mod"]
                ) {
                    user_badges.push({
                        badge_url: BadgesData["FFZ"]["user"]["mod"],
                        alt: "Moderator",
                        background_color: "#00ad03",
                    });

                    continue;
                }

                if (badge.id === "vip_1" && BadgesData["FFZ"]["user"]["vip"]) {
                    user_badges.push({
                        badge_url: BadgesData["FFZ"]["user"]["vip"],
                        alt: "VIP",
                        background_color: "#e005b9",
                    });

                    continue;
                }
            }

            if (badge)
                user_badges.push({
                    badge_url: badge.url,
                    alt: badge.title,
                    background_color: undefined,
                });
        }
    }

    if (onlyTwitchBadges) return user_badges;

    // OTHER BADGES

    // CHATTERINO & CHATTERINO HOMIES
    const foundChatterinoBadges = [
        ...BadgesData["OTHER"]["Chatterino"],
        ...BadgesData["OTHER"]["ChatterinoHomies"],
    ].filter((badge) => badge.users.includes(userstate["user-id-raw"]));

    if (foundChatterinoBadges) {
        foundChatterinoBadges.forEach((foundChatterinoBadge) => {
            user_badges.push({
                badge_url:
                    foundChatterinoBadge.image3 ||
                    foundChatterinoBadge.image2 ||
                    foundChatterinoBadge.image1,
                alt: foundChatterinoBadge.tooltip,
                background_color: undefined,
            });
        });
    }

    // FFZ
    const foundFFZBadges = BadgesData["FFZ"]["global"].filter((badge) =>
        badge.owners.includes(userstate["username"]),
    );

    const foundFFZBadge = BadgesData["FFZ"]["global"].find(
        (badge) =>
            badge.id == BadgesData["FFZ"]["user"]["user"][userstate["user-id"]],
    );

    if (foundFFZBadge) foundFFZBadges.push(foundFFZBadge);

    foundFFZBadges.forEach((foundFFZBadge) => {
        user_badges.push({
            badge_url: foundFFZBadge.urls[foundFFZBadge.urls.length - 1].url,
            alt: foundFFZBadge.title,
            background_color: foundFFZBadge.color,
        });
    });

    // BTTV
    const foundBTTVBadge = BadgesData["BTTV"]["global"].find((badge) =>
        badge.owners.includes(userstate?.["user-id"]),
    );

    if (foundBTTVBadge) {
        user_badges.push({
            badge_url: foundBTTVBadge.url,
            alt: foundBTTVBadge.title,
            background_color: undefined,
        });
    }

    // TurtegBot
    const foundTurtegBotBadge = BadgesData["OTHER"]["TurtegBot"].find((badge) =>
        badge.users?.includes(userstate["user-id-raw"]),
    );

    if (foundTurtegBotBadge) {
        user_badges.push({
            badge_url: foundTurtegBotBadge.image,
            alt: foundTurtegBotBadge.title,
            background_color: undefined,
        });
    }

    // 7TV
    const found7TVBadge = getBadge(
        userstate["user-id"] ?? messageInfo?.["user_id"],
    );

    if (found7TVBadge) {
        user_badges.push({
            badge_url: found7TVBadge.urls[found7TVBadge.urls.length - 1].url,
            alt: found7TVBadge.name,
            background_color: undefined,
        });
    }

    // Poland_BOT
    const foundPolandBOTBadge = Object.entries(
        BadgesData["OTHER"]["PolandBOT"],
    ).find(([role, userList]) => userList.includes(userstate["user-id-raw"]));

    if (foundPolandBOTBadge) {
        const [role] = foundPolandBOTBadge;

        user_badges.push({
            badge_url: `https://devpoland.xyz/badges/${role}.avif`,
            alt: role,
            background_color: undefined,
        });
    }

    return user_badges;
}
