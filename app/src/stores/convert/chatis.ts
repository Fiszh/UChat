import type { Converter } from "$types/converter";

export default {
    channel: [
        {
            param: "channel",
            values: null,
        },
    ],
    shadow: [
        {
            param: "fontShadow",
            values: {
                "0": "0",
                "1": "5",
                "2": "7",
                "3": "10",
            },
        },
    ],
    size: [
        {
            param: "fontSize",
            values: {
                "1": "20",
                "2": "34",
                "3": "48",
            },
        },
        {
            param: "emoteSize",
            values: {
                "1": "25",
                "2": "42",
                "3": "60",
            },
        },
    ],
    stroke: [
        {
            param: "fontStroke",
            values: {
                "0": "0",
                "1": "1",
            },
        },
    ],
    animate: [
        {
            param: "smoothScroll",
            values: "boolean",
        },
    ],
    small_caps: [
        {
            param: "msgCaps",
            values: "boolean",
        },
    ],
    emoteScale: [
        {
            param: "emoteSize",
            priority: true,
            values: [
                {
                    param: "size",
                    value: "1",
                    values: {
                        "2": "50",
                        "3": "75",
                    },
                },
                {
                    param: "size",
                    value: "2",
                    values: {
                        "2": "84",
                        "3": "126",
                    },
                },
                {
                    param: "size",
                    value: "3",
                    values: {
                        "2": "120",
                        "3": "180",
                    },
                },
            ],
        },
    ],
    fade: [
        {
            param: "fadeOut",
            values: null,
        },
    ],
    bots: [
        {
            param: "bots",
            values: "boolean",
        },
    ],
} as Converter.Settings;
