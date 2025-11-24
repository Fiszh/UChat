import { writable } from 'svelte/store';

interface Emotes {
    "7TV": {
        global: ParsedEmote[];
        channel: Record<string, ParsedEmote[]>;
    };
    "BTTV": {
        global: ParsedEmote[];
        channel: Record<string, ParsedEmote[]>;
    };
    "FFZ": {
        global: ParsedEmote[];
        channel: Record<string, ParsedEmote[]>;
    };
    "BITS": any[];
}

interface LoadingInfo {
    text: string | undefined;
    type: string | undefined;
}

export let loadingInfo = writable<LoadingInfo>({text: undefined, type: undefined});

export const globals = {
    // BOT LIST
    custom_bots: [
        "poland_bot",
        "ftk789_bot",
        "mrsmalvic",
        "gofishgame",
        "reapsex",
        "timeoutwithbits", // from speedyemperor
        "soundalerts", // from speedyemperor
    ] as string[],
    /*
    If you want your bot added, open a PR on the repo.
    I’ll probably accept it, but no guarantees.
    Make sure your bot isn’t on the FFZ bots list or doesn't have the Twitch Chat Bot badge before submitting
    */

    manifest_path: "manifest.json",
    chat_version: "" as string,

    // EMOTES
    emotes: {
        "7TV": { global: [], channel: {} } as Emotes["7TV"],
        "BTTV": { global: [], channel: {} } as Emotes["BTTV"],
        "FFZ": { global: [], channel: {} } as Emotes["FFZ"],
        "BITS": [] as Emotes["BITS"],
    } as Emotes,

    badges: {
        "TTV": {
            "sub": [],
            "global": [],
            "bit": [],
        },
        "BTTV": {
            "global": [],
        },
        "FFZ": {
            "global": [],
            "user": []
        },
        "OTHER": {
            "Chatterino": [],
            "ChatterinoHomies": []
        },
        "channel": {} as Record<string, string> // AVATAR BADGES FOR SHARED CHAT
    },

    // TTV
    channelTwitchID: null as string | null,
    channelTwitchName: null as string | null,

    TTVUsersData: [] as any[],

    // 7TV
    SevenTVID: null as string | null,
    SevenTVemoteSetId: null as string | null,

    // OTHER
};
