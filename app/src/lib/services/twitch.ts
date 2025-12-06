export async function valideToken(accessToken: string): Promise<Record<string, string>|false> {
    const response = await fetch('https://api.unii.dev/validate', {
        headers: {
            "x-auth-token": `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Error validating accessToken...');
    }

    const data = await response.json();

    if (data?.login) {
        return {
            login: data?.login,
            user_id: data?.user_id,
        };
    }

    return false;
}