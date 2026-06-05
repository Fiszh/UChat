export const load = async ({ fetch }) => {
    try {
        const res = await fetch(`https://api.unii.dev/status`);
        const data = await res.json();
        return { statusMessage: data as StatusMessage };
    } catch {
        return { statusMessage: null };
    }
};
