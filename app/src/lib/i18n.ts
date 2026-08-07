import { browser } from "$app/environment";
import { init, locale, register } from "svelte-i18n";

const defaultLocale = "en";

export const localeNames: { [key: string]: string } = {
    en: "English",
    // add more as translations land
};

register("en", () => import("$locales/en.json"));

function getInitialLocale() {
    if (browser) {
        const saved = window.localStorage.getItem("locale");
        if (saved) return saved;
    }
    return defaultLocale;
}

locale.subscribe((l) => {
    if (browser && l) window.localStorage.setItem("locale", l);
});

export const initI18n = () =>
    init({
        initialLocale: getInitialLocale(),
        fallbackLocale: defaultLocale,
    });

initI18n();
