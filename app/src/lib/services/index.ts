import SevenTV_main from "#lib/services/7TV/main.js";
import SevenTV_ws from "#lib/services/7TV/websocket.js";

import BTTV_main from "#lib/services/BTTV/main.js";
import BTTV_ws from "#lib/services/BTTV/websocket.js";

import FFZ_main from "#lib/services/FFZ/main.js";

import { TWITCHSocket } from "./TWITCH/chat";
import TTV_main from "#lib/services/TWITCH/main.js";

import KICKSocket from "./KICK/chat";
import KICK_main from "#lib/services/KICK/main.js";

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
