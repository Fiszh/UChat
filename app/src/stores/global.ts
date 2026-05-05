import { writable } from "svelte/store";

export let icon_size = writable<string>("1.5rem");
export let isMobile = writable<boolean>(false);

interface LoadingInfo {
    text: string | undefined;
    type: string | undefined;
}

export let loadingInfo = writable<LoadingInfo>({
    text: undefined,
    type: undefined,
});

interface Emotes {
    "7TV": {
        global: ParsedEmote[];
        channel: Record<string, SavedSevenTVSet | Record<string, never>>;
    };
    BTTV: {
        global: ParsedEmote[];
        channel: Record<string, ParsedEmote[]>;
    };
    FFZ: {
        global: ParsedEmote[];
        channel: Record<string, ParsedEmote[]>;
    };
    BITS: any[];
}

interface Badges {
    UChat: any[];
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
            user: Record<string, number | string>;
        };
    };
    OTHER: {
        Chatterino: any[];
        ChatterinoHomies: any[];
        PolandBOT: Record<string, string[]>;
        TurtegBot: any[];
    };
    channel: Record<string, string>;
}

export const emotes = writable<Emotes>({
    "7TV": { global: [], channel: {} },
    BTTV: { global: [], channel: {} },
    FFZ: { global: [], channel: {} },
    BITS: [],
});

export const badges = writable<Badges>({
    UChat: [],
    TTV: { sub: [], global: [], bit: [] },
    BTTV: { global: [] },
    FFZ: { global: [], user: { vip: "", mod: "", user: {} } },
    OTHER: {
        Chatterino: [],
        ChatterinoHomies: [],
        PolandBOT: {},
        TurtegBot: [],
    },
    channel: {},
});

interface Globals {
    custom_bots: string[];

    channelTwitchID: string | null;
    channelTwitchName: string | null;

    inSharedChat: boolean;

    SevenTVID: string | null;
    SevenTVemoteSetId: string | null;

    userNameColor: Record<string, string>;
}

export const globals: Globals = {
    // BOT LIST
    custom_bots: [
        "poland_bot",
        "ftk789_bot",
        "mrsmalvic",
        "gofishgame",
        "reapsex",
        "timeoutwithbits", // from speedyemperor
        "soundalerts", // from speedyemperor
        "rancbot", // from fehleno
        "waga_bot", // from fehleno
    ],
    /*
    If you want your bot added, open a PR on the repo.
    I’ll probably accept it, but no guarantees.
    Make sure your bot isn’t on the FFZ bots list or doesn't have the Twitch Chat Bot badge before submitting
    */

    // TTV
    channelTwitchID: null,
    channelTwitchName: null,

    inSharedChat: false,

    // 7TV
    SevenTVID: null,
    SevenTVemoteSetId: null,

    // OTHER
    userNameColor: {},
};
