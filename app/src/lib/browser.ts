import { browser } from "$app/environment";

export const isSafari = () =>
    browser
        ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        : false;

export const isChrome = () =>
    browser
        ? /chrome|chromium|crios/i.test(navigator.userAgent) &&
          !/edg/i.test(navigator.userAgent)
        : false;

export const isFirefox = () =>
    browser ? /firefox|fxios/i.test(navigator.userAgent) : false;

export const isEdge = () =>
    browser ? /edg/i.test(navigator.userAgent) : false;
