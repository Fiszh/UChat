export type Stripe = string | [color: string, weight: number];

export function gradientStops(stripes: readonly Stripe[]): {
    offset: number;
    color: string;
}[] {
    const norm = stripes.map((s) =>
        typeof s === "string" ? ([s, 1] as const) : s,
    );
    const total = norm.reduce((sum, [, w]) => sum + w, 0);

    let acc = 0;
    return norm.flatMap(([color, w]) => {
        const start = acc / total;
        acc += w;
        return [
            { offset: start, color },
            { offset: acc / total, color },
        ];
    });
}
