const sourceUrl = new URL("../src/locales/en.json", import.meta.url);
const outputUrl = new URL("../src/locales/en-XA.json", import.meta.url);
const source: unknown = await Bun.file(sourceUrl).json();

const characterMap: Record<string, string> = {
    a: "å",
    b: "ƀ",
    c: "ç",
    d: "đ",
    e: "ë",
    f: "ƒ",
    g: "ğ",
    h: "ħ",
    i: "ï",
    j: "ĵ",
    k: "ķ",
    l: "ľ",
    m: "ɱ",
    n: "ñ",
    o: "ø",
    p: "þ",
    q: "ʠ",
    r: "ř",
    s: "ş",
    t: "ŧ",
    u: "ü",
    v: "ṽ",
    w: "ŵ",
    x: "ẋ",
    y: "ÿ",
    z: "ž",
};

function pseudoLocalize(value: unknown): unknown {
    if (typeof value === "string") {
        const translated = value.replace(/\{[^}]+\}|[A-Za-z]/g, (part) => {
            if (part.startsWith("{")) return part;

            const replacement = characterMap[part.toLowerCase()] ?? part;
            return part === part.toUpperCase()
                ? replacement.toUpperCase()
                : replacement;
        });

        return `⟦${translated.replace(/[åëïøü]/g, "$&$&")}⟧`;
    }

    if (Array.isArray(value)) return value.map(pseudoLocalize);

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, child]) => [
                key,
                pseudoLocalize(child),
            ]),
        );
    }

    return value;
}

await Bun.write(
    outputUrl,
    `${JSON.stringify(pseudoLocalize(source), null, 4)}\n`,
);
console.log("Generated src/locales/en-XA.json from src/locales/en.json");
