import { addToast } from "./toast";
import { get } from "svelte/store";
import { t } from "svelte-i18n";

export interface LocalFontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;
}

export const font_preload = [
    "Just Sans",
    "BLMelody",
    "Satoshi",
    "Geist",
    "Intern",
];

export async function queryLocalFonts(): Promise<LocalFontData[] | string> {
    let data: LocalFontData[] | string = [];
    if (typeof window == "undefined") return data;

    try {
        const status = await (navigator as any).permissions.query({
            name: "local-fonts",
        });

        if (status.state == "denied")
            throw new Error(get(t)("toasts.local_fonts_denied"));

        if (status.state == "granted" || status.state == "prompt") {
            if ("queryLocalFonts" in window) {
                data = await (window as any).queryLocalFonts();
            } else {
                throw new Error(get(t)("toasts.local_fonts_unsupported"));
            }
        }
    } catch (err: any) {
        const msg =
            err?.name === "SecurityError"
                ? get(t)("toasts.local_fonts_click_required")
                : err.message;

        console.error("Failed to fetch local fonts:", err);
        addToast({ msg, type: "error", timeout: 5 });
        data = err.message;
    } finally {
        return data;
    }
}

export async function getFontFamilys(): Promise<string[]> {
    const fontData = await queryLocalFonts();

    return !Array.isArray(fontData)
        ? font_preload
        : [
              ...new Set([
                  ...font_preload,
                  ...fontData.map((font) => font.family),
              ]),
          ];
}
