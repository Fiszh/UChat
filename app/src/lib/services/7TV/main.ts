interface Emote {
    id: string;
    name: string;
    data: {
        name: string;
        listed: boolean;
        flags?: any;
        host: {
            url: string;
            files: { name: string; width: number; height: number; format: string }[];
        };
        owner?: { display_name?: string; username?: string };
    };
}

async function parseSetData(data: Emote[], emoteSet?: string): Promise<ParsedEmote[]> {
    return data.map((emote: Emote) => {
        const emote4x = emote.data.host.files.find(f => f.name === "4x.avif")
            || emote.data.host.files.find(f => f.name === "3x.avif")
            || emote.data.host.files.find(f => f.name === "2x.avif")
            || emote.data.host.files.find(f => f.name === "1x.avif");

        return <ParsedEmote>{
            name: emote?.name,
            original_name: emote?.data?.name,
            emote_id: emote?.id,
            flags: emote?.data?.flags,
            url: `https://cdn.7tv.app/emote/${emote.id}/${emote4x?.name || "1x.avif"}`,
            set: emoteSet === 'global' ? 'Global 7TV' : '7TV'
        };
    });
}

async function emoteSetViaSetID(emoteSetId: string) {
    let emote_data: any[] = [];

    try {
        const response = await fetch(`https://7tv.io/v3/emote-sets/${emoteSetId}`);

        if (response.ok) {
            const data = await response.json();

            if (data.emotes) {
                emote_data = await parseSetData(data.emotes, emoteSetId);
            };
        }
    } catch (error) {
        throw new Error(`Error fetching emote data: ${error}`);
    } finally {
        return emote_data;
    }
}

async function emoteSetViaTwitchID(twitchID: string | number) {
    let emote_data: any[] = [];

    try {
        const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchID}`);

        if (response.ok) {
            const data = await response.json();

            if (data?.emote_set?.emotes) {
                emote_data = await parseSetData(data.emote_set.emotes);
            };
        }
    } catch (error) {
        throw new Error(`Error fetching emote data: ${error}`);
    } finally {
        return emote_data;
    }
}

interface UserInfo {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
    emote_set_id: string
    emote_data: any[]
    twitch: {
        id: string;
        username: string;
        display_name: string;
    }
}

async function getUserViaTwitchID(twitchID: string | number) {
    let user_info: UserInfo | null = null;

    try {
        const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchID}`);

        if (response.ok) {
            const data = await response.json();

            if (data?.user) {
                const user_data = data.user;

                const emote_data = await parseSetData(data?.emote_set?.emotes || []);

                user_info = {
                    id: user_data?.id,
                    username: user_data?.username,
                    display_name: user_data?.display_name,
                    avatar_url: user_data?.avatar_url,
                    emote_set_id: data?.emote_set_id,
                    emote_data,
                    twitch: {
                        id: data?.id,
                        username: data?.username,
                        display_name: data?.display_name,
                    }
                }
            };
        }
    } catch (error) {
        throw new Error(`Error fetching user data: ${error}`);
    } finally {
        return user_info;
    }
}

export default {
    parseSetData,
    getUserViaTwitchID,
    emoteSet: {
        bySetID: emoteSetViaSetID,
        byTwitchID: emoteSetViaTwitchID,
    },
}