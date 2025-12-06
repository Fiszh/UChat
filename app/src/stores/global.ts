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

export let loadingInfo = writable<LoadingInfo>({ text: undefined, type: undefined });

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

interface Badges {
    UChat: any[]
    TTV: {
        sub: any[];
        global: any[];
        bit: any[];
    };
    BTTV: {
        global: any[];
    };
    FFZ: {
        global: any[];
        user: {
            vip: string;
            mod: string;
            user: Record<string, number|string>;
        };
    };
    OTHER: {
        Chatterino: any[];
        ChatterinoHomies: any[];
    };
    channel: Record<string, string>;
}

export const emotes = writable<Emotes>({
    "7TV": { global: [], channel: {} },
    "BTTV": { global: [], channel: {} },
    "FFZ": { global: [], channel: {} },
    "BITS": []
});

export const badges = writable<Badges>({
    UChat: [],
    TTV: { sub: [], global: [], bit: [] },
    BTTV: { global: [] },
    FFZ: { global: [], user: { vip: "", mod: "", user: {} } },
    OTHER: { Chatterino: [], ChatterinoHomies: [] },
    channel: {}
});

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

    // TTV
    channelTwitchID: null as string | null,
    channelTwitchName: null as string | null,

    // 7TV
    SevenTVID: null as string | null,
    SevenTVemoteSetId: null as string | null,

    // OTHER
    userNameColor: {} as Record<string, string>,
}