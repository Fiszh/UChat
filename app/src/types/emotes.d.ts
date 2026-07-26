declare namespace Emotes {
    interface Bits {
        name: string;
        tiers: {
            min_bits: number;
            url: string;
            emote_link: string;
            color: string;
        }[];
        site: "TTV";
    }
}
