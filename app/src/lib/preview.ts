import { badges } from "$stores/global";
import { get } from "svelte/store";
import { messages } from "./chat";

export async function getBadges() {
    const response = await fetch(`https://api.ivr.fi/v2/twitch/badges/global`, {
        headers: {
            accept: "application/json",
        },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    const previewData = (data || []).flatMap((badge: Record<string, any>) => {
        return (badge?.versions || []).flatMap(
            (version: Record<string, any>) => ({
                id: badge.set_id + "_" + version.id,
                url:
                    version.image_url_4x ||
                    version.image_url_2x ||
                    version.image_url_1x ||
                    "",
                title: version.title,
            }),
        );
    });

    badges.update((e) => ({
        ...e,
        TTV: {
            ...e.TTV,
            global: previewData,
        },
    }));
}

function randomString(len: number) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < len; i++)
        out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

function pickRandomBadges(): Record<string, string>[] {
    const count = Math.floor(Math.random() * 2) + 1;
    const badges_data = get(badges);
    const shuffled = badges_data["TTV"]["global"].sort(
        () => 0.5 - Math.random(),
    );
    return shuffled.slice(0, count);
}

export function sendFakeMessage(message: string) {
    const username = randomString(5);
    const displayName = username;
    const userId = Math.floor(Math.random() * 1_000_000_000).toString();

    const badgesPicked = pickRandomBadges() as Record<string, string>[];

    const badgesRaw = badgesPicked
        .map((b: Record<string, string>) => {
            const badge_split = b.id.split("_");

            return `${badge_split[0]}/${badge_split[1]}`;
        })
        .join(",");
    const badges_parsed: Record<string, string> = {};
    badgesPicked.forEach((b: Record<string, string>) => {
        const badge_split = b.id.split("_");

        badges_parsed[badge_split[0]] = badge_split[1];
    });

    const tags = {
        username,
        "display-name": displayName,
        "user-id": userId,
        "badges-raw": badgesRaw,
        badges,
        color: null,
        "room-id": "0",
    };

    messages.update((msgs) => [...msgs, { tags, message }]);
}
