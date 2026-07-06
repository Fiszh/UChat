export namespace Badges {
    interface Twitch {
        id: string;
        url: string;
        title: string;
    }

    interface parsed {
        badge_url: string;
        alt: string;
        background_color?: string;
    }

    interface SevenTV {
        id: string;
        name: string;
        tooltip: any;
        owner: any[];
        urls: any;
    }

    interface Chatterino {
        id?: string;
        tooltip: string;
        users: string[];
        image1: string;
        image2: string;
        image3: string;
    }

    interface TurtegBadge {
        id: number;
        title: string;
        image: string;
        urls: {
            "1": string;
            "2": string;
            "3": string;
            "4": string;
        };
        svg: boolean;
        users: string[];
    }

    interface UChat {
        id: string;
        urls: {
            "1x": string;
            "2x": string;
            "3x": string;
            "4x": string;
        };
        type: string;
        title: string;
        users: string[];
    }

    interface BTTV {
        id: string;
        title: string;
        url: string;
        owners: string[];
    }

    interface FFZ {
        id: number;
        title: string;
        color: string;
        urls: {
            url: string;
            scale: string;
        }[];
        owners: string[];
    }
}

export {};
