import { badges } from '$stores/global';

import FFZ_main from '$lib/services/FFZ/main';

export async function getFFZBadges() {
    const globalBadges = await FFZ_main.getBadges();

    badges.update(e => {
        e["FFZ"]["global"] = globalBadges;

        return e;
    });
}