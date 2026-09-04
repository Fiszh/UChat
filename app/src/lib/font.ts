export const normalizeFont = (font: string): string =>
    font
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
