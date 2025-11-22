interface cosmetics {
    badges: Record<string, SevenTVBadge>
    paints: Record<string, Paint>
    sets: Record<string, any>
}

export let cosmetics: cosmetics = {
    badges: {},
    paints: {},
    sets: {}
}