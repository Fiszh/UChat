import { settingsParams, type Setting } from "$stores/settings";

export function setParam(key: string, value: Setting["value"]) {
    settingsParams.update((arr) => {
        arr[key] = value;

        return arr;
    });
}

export function removeParam(key: string) {
    settingsParams.update((arr) => {
        const { [key]: _, ...rest } = arr;

        return rest;
    });
}
