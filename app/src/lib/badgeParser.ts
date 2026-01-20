import { get } from "svelte/store";

import { getBadge } from "$lib/services/7TV/cosmetics";

import { badges } from '$stores/global';

let BadgesData: Record<string, any> = get(badges);

badges.subscribe((e: any) => BadgesData = e);

export function parseBadges(userstate: Record<string, any>, badgeData?: Record<string, any>): parsedBadge[] {
    let user_badges = [];
    const badges_data = badgeData || BadgesData;

    // SHARED CHAT BADGE
    const foundAvatarBadge = badges_data["channel"]?.[userstate["source-room-id"]];

    if (foundAvatarBadge) {
        user_badges.push({
            badge_url: foundAvatarBadge,
            alt: "Shared Chat",
            background_color: undefined,
        });
    }

    // SHARED CHAT BADGE
    const foundUChatBadges = badges_data["UChat"].filter((badge: Record<string, any>) => badge.users.includes(userstate["user-id-raw"]));

    foundUChatBadges.forEach((foundUChatBadge: Record<string, any>) => {
        user_badges.push({
            badge_url: foundUChatBadge.urls["4x"],
            alt: foundUChatBadge.id,
            background_color: undefined,
        });
    });

    // THIS NEEDS TO BE ALWAYS ON THE START TO MAKE SURE TWITCH BADGES WILL BE FIRST
    if (userstate['badges-raw'] && Object.keys(userstate['badges-raw']).length) {
        let rawBadges = userstate['badges-raw'];
        let badgesSplit = rawBadges.split(',');

        for (const Badge of badgesSplit) {
            let badgeSplit = Badge.split("/");

            if (badgeSplit[0] === 'subscriber' && badges_data["TTV"].sub) { // SUB BADGES
                if (userstate?.badges?.["subscriber"]) {
                    const badge = badges_data["TTV"].sub.find((badge: Badge) => badge.id === userstate.badges["subscriber"]) as Badge | undefined;

                    if (badge) {
                        user_badges.push({
                            badge_url: badge.url,
                            alt: badge.title,
                            background_color: undefined
                        });

                        continue;
                    }
                }
            } else if (badgeSplit[0] === "bits" && badges_data["TTV"].bit) { // BIT BADGES
                if (userstate?.badges?.["bits"]) {
                    const badge = badges_data["TTV"].bit.find((badge: Badge) => badge.id === userstate.badges["bits"]) as Badge | undefined;

                    if (badge) {
                        user_badges.push({
                            badge_url: badge.url,
                            alt: badge.title,
                            background_color: undefined
                        });

                        continue;
                    }
                }
            }

            // SEARCH IN GLOBAL IF NO CHANNEL BADGE FOUND
            const badge = badges_data["TTV"].global.find((badge: Badge) => badge.id === `${badgeSplit[0]}_${badgeSplit[1]}`) as Badge | undefined;

            if (badge && badge.id) {
                if (badge.id === "moderator_1" && badges_data["FFZ"]["user"]["mod"]) {
                    user_badges.push({
                        badge_url: badges_data["FFZ"]["user"]["mod"],
                        alt: "Moderator",
                        background_color: "#00ad03"
                    });

                    continue;
                }

                if (badge.id === "vip_1" && badges_data["FFZ"]["user"]["vip"]) {
                    user_badges.push({
                        badge_url: badges_data["FFZ"]["user"]["vip"],
                        alt: "VIP",
                        background_color: "#e005b9"
                    });

                    continue;
                }
            }

            if (badge) {
                user_badges.push({
                    badge_url: badge.url,
                    alt: badge.title,
                    background_color: undefined
                });
            }
        }
    }

    // OTHER BADGES

    // CHATTERINO & CHATTERNI HOMIES
    const foundChatterinoBadges = [...badges_data["OTHER"]["Chatterino"], ...badges_data["OTHER"]["ChatterinoHomies"]].filter(badge => badge.owners.includes(userstate["user-id-raw"]));

    if (foundChatterinoBadges) {
        foundChatterinoBadges.forEach((foundChatterinoBadge: Badge) => {
            user_badges.push({
                badge_url: foundChatterinoBadge.url,
                alt: foundChatterinoBadge.title,
                background_color: undefined,
            });
        })
    }

    // FFZ
    const foundFFZBadges = badges_data["FFZ"]["global"].filter((badge: Record<string, any>) => badge.owners.includes(userstate["username"]));
    const foundFFZBadge = badges_data["FFZ"]["global"].find((badge: Record<string, any>) => badge.id == badges_data["FFZ"]["user"]["user"][userstate["user-id"]]);

    if (foundFFZBadge) {
        foundFFZBadges.push(foundFFZBadge);
    }

    foundFFZBadges.forEach((foundFFZBadge: Badge) => {
        user_badges.push({
            badge_url: foundFFZBadge.urls[foundFFZBadge.urls.length - 1].url,
            alt: foundFFZBadge.title,
            background_color: foundFFZBadge.color,
        });
    });

    // BTTV
    const foundBTTVBadge = badges_data["BTTV"]["global"].find((badge: Record<string, any>) => badge.providerId == userstate?.["user-id"]);

    if (foundBTTVBadge) {
        user_badges.push({
            badge_url: foundBTTVBadge?.badge?.svg,
            alt: foundBTTVBadge?.badge?.description,
            background_color: undefined
        });
    }

    // 7TV
    const found7TVBadge = getBadge(userstate['user-id']);

    if (found7TVBadge) {
        user_badges.push({
            badge_url: found7TVBadge.urls[found7TVBadge.urls.length - 1].url,
            alt: found7TVBadge.name,
            background_color: undefined
        });
    }

    return user_badges as parsedBadge[];
}