import { type Setting, settings } from "$stores/settings";

function paramToValue(type: Setting["type"], value: string): Setting["value"] {
    if (["boolean"].includes(type)) {
        return value == "1";
    } else if (["selector"].includes(type)) {
        return Number(value);
    }

    return value;
}

export async function importConfig(input: string) {
    if (!input.startsWith(window.location.origin))
        throw new Error("Config URL must be from the same origin");

    const url = new URL(input);
    const params = url.searchParams.entries();
    const mappedParams = Array.from(params).reduce<Record<string, string>>(
        (acc, [key, value]) => {
            acc[key] = value;
            return acc;
        },
        {},
    );

    settings.update((s) => {
        for (const setting of s) {
            if (setting["param"] in mappedParams) {
                setting["value"] = paramToValue(
                    setting["type"],
                    mappedParams[setting["param"]],
                );
            }
        }

        return s;
    });
}
