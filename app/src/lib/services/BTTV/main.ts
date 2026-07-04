import type { Badges } from "$types/badges";

const BTTVZeroWidth = [
    "SoSnowy",
    "IceCold",
    "SantaHat",
    "TopHat",
    "ReinDeer",
    "CandyCane",
    "cvMask",
    "cvHazmat",
];

interface Emote {
    id: string;
    code: string;
    codeOriginal: string;
    listed: boolean;
    flags?: any;
    host: {
        url: string;
        files: {
            name: string;
            width: number;
            height: number;
            format: string;
        }[];
    };
    user?: { displayName?: string; name?: string };
}

interface BadgeUser {
    providerId: string;
    badge: {
        description: string;
        svg: string;
    };
}

async function parseSetData(
    data: Emote[],
    emoteSet?: string,
): Promise<ParsedEmote[]> {
    return data.map((emote: Emote) => {
        return <ParsedEmote>{
            name: emote.code,
            original_name: emote?.codeOriginal,
            emote_id: emote.id,
            flags: BTTVZeroWidth.includes(emote.code) ? 256 : undefined,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
            set: emoteSet == "global" ? "Global BTTV" : "BTTV",
        };
    });
}

async function getGlobalEmoteSet() {
    let emote_data: any[] = [];

    try {
        const response = await fetch(
            `https://api.betterttv.net/3/cached/emotes/global`,
        );

        if (response.ok) {
            const data = await response.json();

            if (data?.length) emote_data = await parseSetData(data, "global");
        }
    } catch (error) {
        throw new Error(`Error fetching emote data: ${error}`);
    } finally {
        return emote_data;
    }
}

async function getEmoteData(twitchID: string | number) {
    let emote_data: any[] = [];

    try {
        const response = await fetch(
            `https://api.betterttv.net/3/cached/users/twitch/${twitchID}`,
        );

        if (response.ok) {
            const data = await response.json();

            if (Object?.keys(data)?.length) {
                const sets = [...data?.channelEmotes, ...data?.sharedEmotes];

                emote_data = await parseSetData(sets);
            }
        }
    } catch (error) {
        throw new Error(`Error fetching emote data: ${error}`);
    } finally {
        return emote_data;
    }
}

interface unparsedBadge {
    id: string;
    name: string;
    displayName: string;
    providerId: string;
    badge: {
        type: number;
        description: string;
        svg: string;
    };
}

async function getBadgeData(): Promise<Badges.BTTV[]> {
    let badge_data: Badges.BTTV[] = [];

    try {
        const response = await fetch(
            `https://api.betterttv.net/3/cached/badges/twitch`,
        );

        if (response.ok) {
            const data: unparsedBadge[] = await response.json();

            badge_data = Object.values(
                data.reduce((acc: Record<string, any>, user) => {
                    const badgeType = String(user.badge.type);
                    if (!acc[badgeType]) {
                        acc[badgeType] = {
                            id: user.badge.description
                                .toLowerCase()
                                .replace(/\s+/g, "_"),
                            title: user.badge.description,
                            url: user.badge.svg,
                            owners: [],
                        };
                    }

                    acc[badgeType].owners.push(user.providerId);

                    return acc;
                }, {}),
            );
        }
    } catch (error) {
        throw new Error(`Error fetching badge data: ${error}`);
    } finally {
        return badge_data;
    }
}

export default {
    parseSetData,
    getGlobalEmoteSet,
    getEmoteData,
    getBadgeData,
};
