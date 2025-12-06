import SevenTV_main from '$lib/services/7TV/main';
import SevenTV_ws from '$lib/services/7TV/websocket';

import BTTV_main from '$lib/services/BTTV/main';
import BTTV_ws from '$lib/services/BTTV/websocket';

import FFZ_main from '$lib/services/FFZ/main';

export const services = {
    "7TV": {
        main: SevenTV_main,
        ws: new SevenTV_ws({ reconnect: true, resubscribeOnReconnect: false }),
    },
    "BTTV": {
        main: BTTV_main,
        ws: new BTTV_ws({ reconnect: true, resubscribeOnReconnect: false }),
    },
    "FFZ": {
        main: FFZ_main
    }
};
