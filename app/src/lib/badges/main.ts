import { badges } from "$stores/global";

import BTTV_main from "$lib/services/BTTV/main";
import FFZ_main from "$lib/services/FFZ/main";
import type { Badges } from "$types/badges";

export async function getFFZBadges() {
    const globalBadges = await FFZ_main.getBadges();

    badges.update((e) => {
        e["FFZ"]["global"] = globalBadges;

        return e;
    });
}

export async function getBTTVBadges() {
    const globalBadges = await BTTV_main.getBadgeData();

    badges.update((e) => {
        e["BTTV"]["global"] = globalBadges;

        return e;
    });
}

interface UChatBadges {
    id: string;
    imgs: {
        animated: {
            "1x": string;
            "2x": string;
            "3x": string;
            "4x": string;
        };
        static: {
            "1x": string;
            "2x": string;
            "3x": string;
            "4x": string;
        };
    };
    type: string;
    title: string;
    users: string[];
}

export async function getMainBadges() {
    const response = await fetch("https://api.unii.dev/badges");

    const data: Record<string, UChatBadges[]> = await response.json();

    const map = [...data["UChat"], ...data["YAUTC"]].map((badge) => ({
        ...badge,
        urls: badge["imgs"]["animated"] || badge["imgs"]["static"],
    }));

    badges.update((e) => {
        e["UChat"] = map;

        return e;
    });
}

export async function getChatterinoBadges() {
    const response = await fetch(`https://api.chatterino.com/badges`, {
        method: "GET",
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data: { badges: Badges.Chatterino[] } = await response.json();

    badges.update((e) => {
        e["OTHER"]["Chatterino"] = data.badges;

        return e;
    });
}

export async function getChatterinoHomiesBadges() {
    let badge_data: Badges.Chatterino[] = [];

    const response0 = await fetch(`https://itzalex.github.io/badges`, {
        method: "GET",
    });

    if (response0.ok) {
        const data: { badges: Badges.Chatterino[] } = await response0.json();

        if (data?.badges) badge_data = [...data.badges];
    }

    const response1 = await fetch(`https://itzalex.github.io/badges2`, {
        method: "GET",
    });

    if (response1.ok) {
        const data: { badges: Badges.Chatterino[] } = await response1.json();

        if (data?.badges) badge_data = [...badge_data, ...data.badges];
    }

    badges.update((e) => {
        e["OTHER"]["ChatterinoHomies"] = badge_data;

        return e;
    });
}

export async function getPolandBOTBadges() {
    const response = await fetch("https://devpoland.xyz/api/roles");
    const data: Record<string, string[]> = await response.json();

    badges.update((e) => {
        e["OTHER"]["PolandBOT"] = data;

        return e;
    });
}

export async function getTurtegBotBadges() {
    const response = await fetch("https://turteg-api.xslash.ovh/v1/ffz/badges");
    const data: { badges: Badges.TurtegBadge[] } = await response.json();

    badges.update((e) => {
        e["OTHER"]["TurtegBot"] = data.badges;

        return e;
    });
}
