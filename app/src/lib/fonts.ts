export interface LocalFontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;
}

export async function queryLocalFonts(): Promise<LocalFontData[] | string> {
    if (typeof window !== "undefined") {
        try {
            const status = await (navigator as any).permissions.query({
                name: "local-fonts",
            });

            if (status.state === "denied") {
                throw new Error("Permission to access local fonts was denied.");
            }

            if (status.state === "granted" || status.state === "prompt") {
                if ("queryLocalFonts" in window) {
                    return await (window as any).queryLocalFonts();
                } else {
                    throw new Error(
                        "Your browser does not support the Local Font Access API.",
                    );
                }
            }
        } catch (err: any) {
            console.error("Failed to fetch local fonts:", err);
            alert(err.message);
            return err.message;
        }
    }
    return [];
}
