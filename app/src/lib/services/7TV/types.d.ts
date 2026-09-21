declare namespace Types7TV {
    interface Set {
        id: string;
        name: string;
        owner: Connection[];
        flags: number;
        emotes: ParsedEmote[];
    }

    interface Connection {
        id: string;
        platform: "TWITCH" | "KICK" | "DISCORD" | "GOOGLE";
        username: string;
        display_name: string;
        linked_at: number;
        emote_capacity: number;
        emote_set_id: string;
        emote_set: null; // always null for some reason
    }

    interface Entitlement {
        id: number | string;
        kind: string;
        owner: Connection[];
    }

    interface ConnectionWithID extends Types7TV.Connection {
        user_id: string;
    }

    interface UserInfo {
        id: string;
        username: string;
        display_name: string;
        avatar_url?: string;
        emote_set_id: string;
        emote_data: ParsedEmote[];
        connections: ConnectionWithID[];
        service: {
            id: string;
            username: string;
            display_name: string;
        };
    }

    interface EventAPIBridgeCosmetic {
        type: "cosmetic.create";
        body: {
            id: string;
            kind: 10;
            contextual: boolean;
            object: {
                id: string;
                kind: "AVATAR";
                data: {
                    id: string;
                    user: {
                        id: string;
                        username: string;
                        display_name: string;
                        avatar_url: string;
                        style: {
                            color: number;
                            paint_id?: string;
                            badge_id?: string;
                        };
                        role_ids: string[];
                        connections: {
                            id: string;
                            platform: string;
                            username: string;
                            display_name: string;
                            linked_at: number;
                            emote_capacity: number;
                            emote_set_id: string;
                        }[];
                    };
                    host: {
                        url: string;
                        files: {
                            name: string;
                            static_name: string;
                            width: number;
                            height: number;
                            frame_count: number;
                            size: number;
                            format: string;
                        }[];
                    };
                };
            };
        };
    }
}

declare namespace WebSocket7TV {
    type entitlement_create = { platform: Platforms; ctx: "channel" };
}
