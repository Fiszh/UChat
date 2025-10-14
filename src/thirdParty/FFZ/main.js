window.ffz = window.ffz || {};

(function () {
    async function parseSetData(data) {
        return data.map(emote => ({
            name: emote.name,
            emote_id: emote.id,
            url: emote.animated
                ? `https://cdn.frankerfacez.com/emote/${emote.id}/animated/4`
                : `https://cdn.frankerfacez.com/emote/${emote.id}/4`,
            emote_link: `https://www.frankerfacez.com/emoticon/${emote.id}`,
            creator: null,
            site: 'FFZ'
        }));
    }

    async function getGlobalEmotes() {
        let emote_data = [];
        try {
            const response = await fetch(`https://api.frankerfacez.com/v1/set/global`);
            if (response.ok) {
                const data = await response.json();
                const emote_sets = Object.values(data?.sets || {}).flatMap(set => set?.emoticons || []);
                emote_data = await parseSetData(emote_sets);
            }
        } catch (error) {
            throw new Error('Error fetching emote data:', error);
        } finally {
            return emote_data;
        }
    }

    async function getUserData(twitchId) {
        let user_data = { set: [], badges: {} };
        try {
            const response = await fetch(`https://api.frankerfacez.com/v1/room/id/${twitchId}`);
            if (response.ok) {
                const data = await response.json();
                if (data?.sets?.[data?.room?.set]?.emoticons) {
                    user_data.set = await parseSetData(data.sets[data.room.set].emoticons);
                }

                const { vip_badge, mod_urls, user_badge_ids } = data.room || {};
                if (vip_badge) {
                    user_data.badges.vip = Object.entries(vip_badge).map(([size, url]) => ({ url, scale: `${size}x` }));
                }
                if (mod_urls) {
                    user_data.badges.mod = Object.entries(mod_urls).map(([size, url]) => ({ url, scale: `${size}x` }));
                }
                if (Object.keys(user_badge_ids || {}).length) {
                    user_data.badges.user_badge_ids = user_badge_ids;
                }
            }
        } catch (error) {
            throw new Error('Error fetching user data:', error);
        } finally {
            return user_data;
        }
    }

    async function getBadges() {
        let badge_data = [];
        try {
            const response = await fetch(`https://api.frankerfacez.com/v1/badges`);
            if (response.ok) {
                const data = await response.json();
                data.badges.forEach(badge => {
                    data.users[badge.id].forEach(username => {
                        badge_data.push({
                            id: badge.title.replace(/\s+/g, '_').toLowerCase(),
                            url: badge.urls["4"],
                            title: badge.title,
                            color: badge.color,
                            owner_username: username
                        });
                    });
                });
            }
        } catch (error) {
            throw new Error('Error fetching badge data:', error);
        } finally {
            return badge_data;
        }
    }

    window.ffz.main = {
        parseSetData,
        getGlobalEmotes,
        getUserData,
        getBadges,
    };
})();
