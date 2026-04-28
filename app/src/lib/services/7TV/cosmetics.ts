import { get } from "svelte/store";

import main from "$lib/services/7TV/main";
const { parseBadgeData, parsePaintData } = main;

import { cosmetics } from "$stores/cosmetics";

// GQL
import cosmetics_single from "./GQL/cosmetics/single.gql?raw";
import cosmetics_multiple from "./GQL/cosmetics/multiple.gql?raw";

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

    return Object.values(currentCosmetics.paints).find((paint: Paint) =>
        paint.owner.find((o: Owner) => o.username === username),
    ) as Paint | undefined;
}

export function getBadge(twitchID: string): Badge | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.badges).find((badge: any) =>
        badge.owner.find((o: Owner) => o.id === String(twitchID)),
    ) as Badge | undefined;
}

export function getPersonalSets(twitchID: string): any | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.sets).filter((set: any) =>
        set.owner.some((o: Owner) => o.id === String(twitchID)),
    ) as any | undefined;
}

export const getPaintHTML = (
    paint_data: Paint,
): { paint: string; shadow: string } => ({
    paint:
        `${paint_data.backgroundImage ? `background-image: ${paint_data.backgroundImage};` : ""}` ||
        "",
    shadow:
        `${paint_data.shadows ? `filter: ${paint_data.shadows};` : ""}` || "",
});

export async function pushUserInfoViaGQL(sevenTV_ID: string): Promise<boolean> {
    const response = await fetch("https://7tv.io/v3/gql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: cosmetics_single,
            variables: {
                id: `${sevenTV_ID}`,
            },
        }),
    });

    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);

        return false;
    }

    let data = await response.json();

    if (data && data["data"]) {
        data = data["data"];
    } else {
        console.error(`No data found!`);
        return false;
    }

    if (
        !data?.["user"] ||
        !data["user"]?.["connections"] ||
        !data["user"]?.["style"]
    )
        return false;

    return await pushUserInfoFromGQL(data);
}

export async function pushUsersInfoViaGQL(
    sevenTV_IDs: string[],
): Promise<boolean> {
    const response = await fetch("https://7tv.io/v3/gql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: cosmetics_multiple,
            variables: {
                list: sevenTV_IDs,
            },
        }),
    });

    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);

        return false;
    }

    let data = await response.json();

    if (data && data["data"]) {
        data = data["data"];

        if (
            data["usersByID"] &&
            Array.isArray(data["usersByID"]) &&
            data["usersByID"].length
        ) {
            for (const user of data["usersByID"]) {
                if (!user["connections"] || !user["style"]) continue;

                await pushUserInfoFromGQL(user);
            }

            return true;
        } else {
            return false;
        }
    } else {
        console.error(`No data found!`);
        return false;
    }
}

async function pushUserInfoFromGQL(data: Record<string, any>): Promise<true> {
    let user = data;
    if (data["user"]) user = data["user"];

    const foundTwitchConnection = user["connections"].find(
        (connection: { platform: string }) => connection?.platform == "TWITCH",
    );

    if (user["style"]["badge"]) {
        const badge = parseBadgeData(user["style"]["badge"]);

        if (badge) {
            if (foundTwitchConnection) badge.owner.push(foundTwitchConnection);

            cosmetics.update((e) => ({
                ...e,
                badges: {
                    ...e.badges,
                    [badge.id]: badge,
                },
            }));
        }
    }

    if (user["style"]["paint"]) {
        const paint = await parsePaintData(user["style"]["paint"]);

        if (paint) {
            if (foundTwitchConnection) paint.owner.push(foundTwitchConnection);

            cosmetics.update((e) => ({
                ...e,
                paints: {
                    ...e.paints,
                    [paint.id]: paint,
                },
            }));
        }
    }

    return true;
}
