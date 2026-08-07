import { browser } from "$app/environment";
import moment from "moment/min/moment-with-locales";
import { init, locale, register } from "svelte-i18n";

const defaultLocale = "en";

export const localeNames: { [key: string]: string } = {
    en: "English",
    pt: "Portuguese",
    // add more as translations land
};

register("en", () => import("$locales/en.json"));
register("pt", () => import("$locales/pt.json"));

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
