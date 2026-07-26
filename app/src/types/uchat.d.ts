declare namespace UChat {
    interface ChannelBadge {
        id: string;
        setID: string;
        version: string;
        title: string;
        image1x: string;
        image2x: string;
        image4x: string;
        clickAction: string;
        clickURL: string;
    }

    interface Channel {
        channel: {
            data: {
                channel_info: {
                    id: string;
                    login: string;
                    displayName: string;
                    chatColor: string;
                };
                channel_badges: {
                    id: string;
                    primaryColorHex: string;
                    broadcastBadges: channelBadge[] | never[];
                };
                channel_cheer_emotes: {
                    cheer: {
                        id: string;
                        cheerGroups: {
                            templateURL: string;
                            nodes: {
                                id: string;
                                prefix: string;
                                type: string;
                                tiers: { id: string; bits: number }[];
                            }[];
                        }[];
                    } | null;
                };
                global_badges: channelBadge[];
                global_cheer_emotes: {
                    displayConfig: {
                        backgrounds: string[];
                        colors: [{ bits: number; color: string }];
                    };
                    groups: {
                        templateURL: string;
                        nodes: {
                            id: string;
                            prefix: string;
                            type: string;
                            campaign: null;
                            tiers: {
                                id: string;
                                bits: number;
                                canShowInBitsCard: boolean;
                            }[];
                        }[];
                    }[];
                };
            };
            extensions: {
                durationMilliseconds: number;
                requestID: string;
            };
        };
        user_settings: Record<
            string,
            string | number | boolean | string[]
        > | null;
    }

    type ChannelResponse =
        | Channel
        | {
              error: string;
          };
}
