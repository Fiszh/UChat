import { get } from "svelte/store";

import main from "$lib/services/7TV/main";
const { parseBadgeData, parsePaintData } = main;

import { cosmetics } from "$stores/cosmetics";

// GQL
import cosmetics_single from "./GQL/cosmetics/single.gql?raw";
import cosmetics_multiple from "./GQL/cosmetics/multiple.gql?raw";

export function getPaint(
    platform: Types7TV.Connection["platform"],
    platformID: string,
): Paint | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.paints).find((paint) =>
        paint.owner.find(
            (c) =>
                (c.id === platformID ||
                    c.username == platformID ||
                    c.display_name == platformID) &&
                c.platform == platform,
        ),
    );
}

export function getBadge(
    platform: Types7TV.Connection["platform"],
    platformID: string,
): SevenTVBadge | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.badges).find((badge) =>
        badge.owner.find(
            (c) =>
                (c.id === platformID ||
                    c.username == platformID ||
                    c.display_name == platformID) &&
                c.platform == platform,
        ),
    );
}

export function getPersonalSets(
    platform: Types7TV.Connection["platform"],
    platformID: string,
): Types7TV.Set[] | undefined {
    const currentCosmetics = get(cosmetics);

    return Object.values(currentCosmetics.sets).filter((set) =>
        set.owner.find(
            (c) =>
                (c.id === platformID ||
                    c.username == platformID ||
                    c.display_name == platformID) &&
                c.platform == platform,
        ),
    );
}

export const getPaintHTML = (paint_data: Paint): Record<string, string> => ({
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
            cosmetics.update((e) => {
                if (e["badges"][badge.id]) {
                    e["badges"][badge.id]["owner"].push(foundTwitchConnection);
                } else {
                    e = {
                        ...e,
                        badges: {
                            ...e.badges,
                            [badge.id]: badge,
                        },
                    };
                }

                return e;
            });
        }
    }

    if (user["style"]["paint"]) {
        const paint = await parsePaintData(user["style"]["paint"]);

        if (paint) {
            cosmetics.update((e) => {
                if (e["paints"][paint.id]) {
                    e["paints"][paint.id]["owner"].push(foundTwitchConnection);
                } else {
                    e = {
                        ...e,
                        paints: {
                            ...e.paints,
                            [paint.id]: paint,
                        },
                    };
                }

                return e;
            });
        }
    }

    return true;
}
