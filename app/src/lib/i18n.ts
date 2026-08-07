import { browser } from "$app/environment";
import moment from "moment/min/moment-with-locales";
import { init, locale, register } from "svelte-i18n";

const defaultLocale = "en";

export const localeNames: { [key: string]: string } = {
    en: "English",
    "en-GB": "English (UK)",
    "pl-PL": "Polish",
    "en-PT": "Pirate Speak",
    "pt-PT": "Portuguese",
    "ar-SA": "Arabic",
    "es-ES": "Spanish",
    // add more as translations land
};

register("en", () => import("$locales/en.json"));
register("en-GB", () => import("$locales/en-GB.json"));
register("pl-PL", () => import("$locales/pl-PL.json"));
register("en-PT", () => import("$locales/en-PT.json"));
register("pt-PT", () => import("$locales/pt-PT.json"));
register("ar-SA", () => import("$locales/ar-SA.json"));
register("es-ES", () => import("$locales/es-ES.json"));

function getInitialLocale() {
    if (browser) {
        const saved = window.localStorage.getItem("locale");
        if (saved) return saved;
    }
    return defaultLocale;
}

locale.subscribe((l) => {
    if (l) {
        if (browser) window.localStorage.setItem("locale", l);
        moment.locale(l);
    }
});

export const initI18n = () =>
    init({
        initialLocale: getInitialLocale(),
        fallbackLocale: defaultLocale,
    });

initI18n();
