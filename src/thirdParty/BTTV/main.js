window.bttv = window.bttv || {};

(function() {
    const BTTVZeroWidth = ["SoSnowy", "IceCold", "SantaHat", "TopHat", "ReinDeer", "CandyCane", "cvMask", "cvHazmat"];

    async function parseSetData(data) {
        return data.map(emote => ({
            name: emote.code,
            emote_id: emote.id,
            url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
            emote_link: `https://betterttv.com/emotes/${emote.id}`,
            original_name: emote?.codeOriginal,
            creator: null,
            site: 'BTTV',
            flags: BTTVZeroWidth.includes(emote.code) ? 256 : undefined
        }));
    }

    async function getGlobalEmoteSet() {
        let emote_data = [];
        try {
            const response = await fetch(`https://api.betterttv.net/3/cached/emotes/global`);
            if (response.ok) {
                const data = await response.json();
                if (data?.length) {
                    emote_data = await parseSetData(data);
                }
            }
        } catch (error) {
            throw new Error('Error fetching emote data:', error);
        } finally {
            return emote_data;
        }
    }

    async function getEmoteData(twitchID) {
        let emote_data = [];
        try {
            const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${twitchID}`);
            if (response.ok) {
                const data = await response.json();
                if (Object?.keys(data)?.length) {
                    const sets = [...data?.channelEmotes, ...data?.sharedEmotes];
                    emote_data = await parseSetData(sets);
                }
            }
        } catch (error) {
            throw new Error('Error fetching emote data:', error);
        } finally {
            return emote_data;
        }
    }

    async function getBadgeData() {
        let badge_data = [];
        try {
            const response = await fetch(`https://api.betterttv.net/3/cached/badges/twitch`);
            if (response.ok) {
                const data = await response.json();
                badge_data = Object.values(
                    data.reduce((acc, user) => {
                        const svg = user.badge.svg;
                        if (!acc[svg]) {
                            acc[svg] = {
                                id: user.badge.description.toLowerCase().replace(/\s+/g, '_'),
                                title: user.badge.description,
                                urls: [{ url: svg, scale: '4x' }],
                                owners: []
                            };
                        }
                        acc[svg].owners.push(user.providerId);
                        return acc;
                    }, {})
                );
            }
        } catch (error) {
            throw new Error('Error fetching badge data:', error);
        } finally {
            return badge_data;
        }
    }

    window.bttv.main = {
        parseSetData,
        getGlobalEmoteSet,
        getEmoteData,
        getBadgeData,
    };
})();
