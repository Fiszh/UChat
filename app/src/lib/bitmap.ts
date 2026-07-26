type Options = { enabled: boolean; disabled?: boolean }[];

export const flags = {
    isEnabled: (bitmap: number, index: number) => (bitmap & (1 << index)) !== 0,

    toggle: (bitmap: number, index: number) => bitmap ^ (1 << index),

    disableAll: () => 0,

    enableAll: (options: Options) =>
        options.reduce(
            (acc, item, i) => (!item.disabled ? acc | (1 << i) : acc),
            0,
        ),

    getDefault: (options: Options) =>
        options.reduce(
            (acc, item, i) =>
                item.enabled && !item.disabled ? acc | (1 << i) : acc,
            0,
        ),

    getEnabled: (bitmap: number, options: Options): Options =>
        options.filter((_, i) => flags.isEnabled(bitmap, i)),

    getDisabled: (bitmap: number, options: Options): Options =>
        options.filter((_, i) => !flags.isEnabled(bitmap, i)),
};
