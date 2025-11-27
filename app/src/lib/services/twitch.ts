export async function valideToken(accessToken: string) {
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
        return data?.login;
    }

    return false;
}