// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    interface Badge {
        id: string;
        title: string;
        name?: string;
        color?: string;
        urls: ScaleUrls[];
        url: string;
        owner?: any[]
    }

    interface parsedBadge {
        badge_url: string;
        alt: string;
        background_color?: string;
    }

    interface SevenTVBadge {
        id: string,
        name: string,
        tooltip: any,
        owner: any[],
        urls: any
    }

    interface Paint {
        id: string;
        name: string;
        style: any;
        shape: any;
        backgroundImage: any;
        shadows: string | null;
        KIND: string;
        owner: any[]
        url: string;
    }

    interface ParsedEmote {
        name: string;
        original_name: string;
        emote_id: string;
        flags: number;
        url: string;
        set: string;
    }
}

export { };
