export async function valideToken(
    accessToken: string,
): Promise<Record<string, string> | false> {
    const response = await fetch("https://api.unii.dev/validate", {
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

export async function getUser(channel: string) {
    const response = await fetch(
        `https://api.ivr.fi/v2/twitch/user?login=${channel}`,
    );

    if (!response.ok) return alert(`Failed to get the channel ${channel}.`);

    return await response.json();
}
