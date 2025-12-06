import { get } from "svelte/store";

import main from "$lib/services/7TV/main";
const { parseBadgeData, parsePaintData } = main;

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

export function getPaint(username: Lowercase<string>): Paint | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.paints).find((paint: Paint) => paint.owner.find((o: Owner) => o.username === username)) as Paint | undefined;
}

export function getBadge(twitchID: string): Badge | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.badges).find((badge: any) => badge.owner.find((o: Owner) => o.id === String(twitchID))) as Badge | undefined;
}

export function getPersonalSets(twitchID: string): any | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.sets).filter((set: any) => set.owner.some((o: Owner) => o.id === String(twitchID))) as any | undefined;
}

export function getPaintHTML(paint_data: Paint): Record<string, string> {
    return {
        paint: `${paint_data.backgroundImage ? `background-image: ${paint_data.backgroundImage};` : ""}` || "",
        shadow: `${paint_data.shadows ? `filter: ${paint_data.shadows};` : ""}` || ""
    }
}

export async function pushUserInfoViaGQL(sevenTV_ID: string): Promise<void> {
    const response = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": "query GetUserForUserPage($id: ObjectID!) { user(id: $id) { id username display_name avatar_url style { color paint { id kind name function color angle shape image_url repeat stops { at color } shadows { x_offset y_offset radius color } } badge { id kind name tooltip tag host { url files { name static_name width height frame_count size format } } } } connections { username id platform } } }",
            "variables": {
                "id": `${sevenTV_ID}`
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();

    if (data && data["data"]) {
        data = data["data"];
    } else {
        throw new Error(`No data found!`);
    }

    if (!data?.["user"] || !data["user"]?.["connections"] || !data["user"]?.["style"]) { return; };

    const foundTwitchConnection = data["user"]["connections"].find((connection: { platform: string }) => connection?.platform == "TWITCH");

    if (data["user"]["style"]["badge"]) {
        const badge = parseBadgeData(data["user"]["style"]["badge"]);

        if (badge) {
            if (foundTwitchConnection) {
                badge.owner.push(foundTwitchConnection);
            }

            cosmetics.update(e => ({
                ...e,
                badges: {
                    ...e.badges,
                    [badge.id]: badge
                }
            }));
        }

    }

    if (data["user"]["style"]["paint"]) {
        const paint = await parsePaintData(data["user"]["style"]["paint"]);

        if (paint) {
            if (foundTwitchConnection) {
                paint.owner.push(foundTwitchConnection);
            }

            cosmetics.update(e => ({
                ...e,
                paints: {
                    ...e.paints,
                    [paint.id]: paint
                }
            }));
        }
    }
}