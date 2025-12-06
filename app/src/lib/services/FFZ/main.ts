interface Emote {
    id: string;
    name: string;
    animated: boolean
    owner: { display_name: string; name: string };
    data: {
        modifier_flags: number;
    };
    urls: {
        url: string;
    };
}

async function parseSetData(data: Emote[], emoteSet?: string): Promise<ParsedEmote[]> {
    return data.map((emote: Emote) => ({
        name: emote?.name,
        original_name: emote?.name,
        emote_id: emote?.id,
        flags: emote?.data?.modifier_flags,
        url: emote.animated
            ? `https://cdn.frankerfacez.com/emote/${emote.id}/animated/4`
            : `https://cdn.frankerfacez.com/emote/${emote.id}/4`,
        set: emoteSet === 'global' ? 'Global FFZ' : 'FFZ'
    }));
}

async function getGlobalEmotes() {
    let emote_data: any = [];

    try {
        const response = await fetch(`https://api.frankerfacez.com/v1/set/global`);

        if (response.ok) {
            const data = await response.json();

            const emote_sets = Object.values(data?.sets || {}).flatMap((set: any) => set.emoticons || []);

            emote_data = await parseSetData(emote_sets, "global");
        }
    } catch (error) {
        throw new Error(`Error fetching emote data: ${error}`);
    } finally {
        return emote_data;
    }
}

async function getUserData(twitchId: string | number) {
    let user_data: { set: ParsedEmote[], badges: any } = {
        set: [],
        badges: {}
    };

    try {
        const response = await fetch(`https://api.frankerfacez.com/v1/room/id/${twitchId}`);

        if (response.ok) {
            const data = await response.json();

            if (data?.sets?.[data?.room?.set]?.emoticons) {
                user_data["set"] = await parseSetData(data.sets[data.room.set].emoticons);
            }

            // BADGES

            if (data.room) {
                const { vip_badge, mod_urls, user_badge_ids } = data.room;

                if (vip_badge) {
                    user_data.badges["vip"] = Object.entries(vip_badge).map(([size, url]) => ({
                        url,
                        scale: `${size}x`
                    }));
                }

                if (mod_urls) {
                    user_data.badges["mod"] = Object.entries(mod_urls).map(([size, url]) => ({
                        url,
                        scale: `${size}x`
                    }));
                }

                if (Object.keys(user_badge_ids)?.length) {
                    user_data.badges["user_badge_ids"] = user_badge_ids;
                }
            }
        }
    } catch (error) {
        throw new Error(`Error fetching user data: ${error}`);
    } finally {
        return user_data;
    }
}

async function getBadges() {
    let badge_data: any = [];

    try {
        const response = await fetch(`https://api.frankerfacez.com/v1/badges`);

        if (response.ok) {
            const data = await response.json();

            badge_data = data?.badges.map((badge: Badge) => {
                const urls = Object.entries(badge.urls).map(([size, url]) => ({
                    url,
                    scale: `${size}x`
                }));

                return {
                    id: badge?.id,
                    title: badge.title,
                    color: badge.color,
                    urls,
                    owners: data?.users?.[badge?.id]
                }
            })
        }
    } catch (error) {
        throw new Error(`Error fetching badge data: ${error}`);
    } finally {
        return badge_data;
    }
}

export default {
    parseSetData,
    getGlobalEmotes,
    getUserData,
    getBadges,
}