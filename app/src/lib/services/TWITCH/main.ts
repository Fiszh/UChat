import { API_URL } from "$stores/global";
import { assignMessage, parseIRCLine } from "./chat";

async function valideToken(
    accessToken: string,
): Promise<Record<string, string> | false> {
    const response = await fetch(API_URL + "/validate", {
        headers: {
            "x-auth-token": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) throw new Error("Error validating accessToken...");

    const data = await response.json();

    if (data?.login)
        return {
            login: data?.login,
            user_id: data?.user_id,
        };

    return false;
}

async function getUser(channel: string) {
    const response = await fetch(
        `https://api.ivr.fi/v2/twitch/user?login=${channel}`,
    );

    if (!response.ok) return alert(`Failed to get the channel ${channel}.`);

    return await response.json();
}

async function getLastMessages(channel_name: string) {
    const response = await fetch(
        `https://recent-messages.robotty.de/api/v2/recent-messages/${channel_name}`,
    );

    if (!response.ok) return console.error(response);

    const data = await response.json();

    if (data?.messages?.length) {
        const messages = data.messages.reverse().slice(0, 100).reverse();

        for (const message of messages) {
            const parsed = parseIRCLine(message);

            assignMessage(parsed);
        }
    }
}

export default {
    valideToken,
    getUser,
    getLastMessages,
};
