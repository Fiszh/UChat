import { badges, globals } from "$stores/global";

export async function getKickUser(name: string) {
    try {
        const res = await fetch("https://kick.com/api/v2/channels/" + name);

        if (!res.ok) return false;

        const data = await res.json();

        globals.channelKickName = data?.user?.username || null;
        globals.userKickID = data?.user_id || null;
        globals.channelKickID = data?.chatroom?.channel_id || null;
        globals.chatroomKickID = data?.chatroom?.id || null;

        type Badge = {
            id: number;
            channel_id: number;
            months: number;
            badge_image: {
                srcset: string;
                src: string;
            };
        }[];

        // CHANNEL BADGES
        const broadcastBadges: Badge | [] =
            data?.channel_badges?.broadcastBadges || [];
        try {
            badges.update((badgeData) => {
                badgeData["KICK"].channel = broadcastBadges.map((badge) => ({
                    id: badge.id,
                    url: badge.badge_image.src,
                }));

                return badgeData;
            });
        } catch (err) {
            console.error("Error loading channel badges:", err);
        }
        return true;
    } catch (err) {
        return false;
    }
}
