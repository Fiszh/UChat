export function setCookie(name: string, value: string, days: number = 30) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export function delCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
}
