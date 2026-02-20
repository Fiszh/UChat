import { badges } from '$stores/global';

import BTTV_main from '$lib/services/BTTV/main';
import FFZ_main from '$lib/services/FFZ/main';

export async function getFFZBadges() {
    const globalBadges = await FFZ_main.getBadges();

    badges.update(e => {
        e["FFZ"]["global"] = globalBadges;

        return e;
    });
}

export async function getBTTVBadges() {
    const globalBadges = await BTTV_main.getBadgeData();

    badges.update(e => {
        e["BTTV"]["global"] = globalBadges;

        return e;
    });
}

export async function getMainBadges() {
    const response = await fetch("https://api.unii.dev/badges");

    const data = await response.json();

    const map = [...data["UChat"], ...data["YAUTC"]].map(badge => {
        if (Object.values(badge["imgs"]["animated"]).length) {
            badge["urls"] = badge["imgs"]["animated"];
        } else {
            badge["urls"] = badge["imgs"]["static"];
        }

        delete badge["imgs"];

        return badge;
    });

    badges.update(e => {
        e["UChat"] = map;

        return e;
    });
}

export async function getChatterinoBadges() {
    const response = await fetch(`https://api.chatterino.com/badges`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    const map = data.badges.map((badge: Record<string, any>) => ({
        id: badge.tooltip.replace(/\s+/g, '_').toLowerCase(),
        url: badge["image3"] || badge["image2"] || badge["image1"] || undefined,
        title: badge.tooltip,
        owners: badge.users
    }));

    badges.update(e => {
        e["OTHER"]["Chatterino"] = map;

        return e;
    });
}

export async function getChatterinoHomiesBadges() {
    let badge_data: any[] = [];

    const response0 = await fetch(`https://itzalex.github.io/badges`, {
        method: 'GET'
    });

    if (response0.ok) {
        const data = await response0.json();

        if (data?.badges) {
            badge_data = [...data.badges];
        }
    }

    const response1 = await fetch(`https://itzalex.github.io/badges2`, {
        method: 'GET'
    });

    if (response1.ok) {
        const data = await response1.json();

        if (data?.badges) {
            badge_data = [...badge_data, ...data.badges];
        }
    }

    const map = badge_data.map((badge: Record<string, any>) => ({
        id: badge?.id || badge.tooltip.replace(/\s+/g, '_').toLowerCase(),
        url: badge["image3"] || badge["image2"] || badge["image1"] || undefined,
        title: badge.tooltip,
        owners: badge.users
    }));

    badges.update(e => {
        e["OTHER"]["ChatterinoHomies"] = map;

        return e;
    });
}

export async function getPolandBOTBadges() {
    const response = await fetch("https://devpoland.xyz/api/roles");
    const data = await response.json();

    badges.update(e => {
        e["OTHER"]["PolandBOT"] = data;

        return e;
    });
}