import { globals } from '$stores/global';

export async function getBadges() {
    const response = await fetch(`https://api.ivr.fi/v2/twitch/badges/global`, {
        headers: {
            accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();

    globals.badges["TTV"].global = (data || []).flatMap((badge: Record<string, any>) => {
        return (badge?.versions || []).flatMap((version: Record<string, any>) => ({
            id: badge.set_id + "_" + version.id,
            url: version.image_url_1x || version.image_url_2x || version.image_url_4x || "",
            title: version.title
        }));
    })
}