import { get } from 'svelte/store';

import { getBadge } from "$lib/services/7TV/cosmetics";

import { badges } from '$stores/global';

export function parseBadges(userstate: Record<string, any>, badgeData?: Record<string, any>): parsedBadge[] {
    let user_badges = [];
    const badges_data = badgeData || get(badges);

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