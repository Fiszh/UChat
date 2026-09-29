import SevenTV_main from "$lib/services/7TV/main";
import SevenTV_ws from "$lib/services/7TV/websocket";

import BTTV_main from "$lib/services/BTTV/main";
import BTTV_ws from "$lib/services/BTTV/websocket";

import FFZ_main from "$lib/services/FFZ/main";

import { TWITCHSocket } from "./TWITCH/chat";
import TTV_main from "$lib/services/TWITCH/main";

import KICKSocket from "./KICK/chat";
import KICK_main from "$lib/services/KICK/main";

import YOUTUBESocket from "./YOUTUBE/chat";

export default {
    "7TV": {
        main: SevenTV_main,
        ws: new SevenTV_ws({ reconnect: true, resubscribeOnReconnect: false }),
    },
    BTTV: {
        main: BTTV_main,
        ws: new BTTV_ws({ reconnect: true, resubscribeOnReconnect: false }),
    },
    FFZ: {
        main: FFZ_main,
    },
    TWITCH: {
        main: TTV_main,
        ws: new TWITCHSocket(),
    },
    KICK: {
        main: KICK_main,
        ws: new KICKSocket(),
    },
    GOOGLE: {
        ws: new YOUTUBESocket(),
    },
};
