import { cosmetics } from "$stores/cosmetics";

interface Owner {
    id: string;
    platform: string;
    username: string;
    display_name: string;
    linked_at: number;
    emote_capacity: number;
    emote_set_id: string;
}

export function getPaint(username: string): Paint | undefined {
    return Object.values(cosmetics.paints).find((paint: Paint) => paint.owner.find((o: Owner) => o.username === username)) as Paint | undefined;
}

export function getBadge(twitchID: string): any | undefined {
    return Object.values(cosmetics.badges).find((badge: any) => badge.owner.find((o: Owner) => o.id === String(twitchID))) as Badge | undefined;
}

export function getPersonalSets(twitchID: string): any | undefined {
    return Object.values(cosmetics.sets).filter((set: any) => set.owner.some((o: Owner) => o.id === String(twitchID))) as any;
}