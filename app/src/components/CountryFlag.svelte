<script lang="ts" module>
    export const flags = {
        en: new URL("$assets/flags/us.svg", import.meta.url).href,
        uk: new URL("$assets/flags/uk.svg", import.meta.url).href,
        pl: new URL("$assets/flags/pl.svg", import.meta.url).href,
        pt: new URL("$assets/flags/pt.svg", import.meta.url).href,
        "en-x-pirate": new URL("$assets/flags/en-x-pirate.svg", import.meta.url)
            .href,
    };

    export type FlagCode = keyof typeof flags;
</script>

<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    type Props = {
        code: FlagCode;
        width?: number;
        height?: number;
    } & HTMLAttributes<HTMLImageElement>;

    let { code, width, height, ...restProps }: Props = $props();
</script>

<img
    src={flags[code]}
    alt={code}
    title={code}
    class="flag"
    width="{width}px"
    height="{height}px"
    {...restProps}
/>

<style lang="scss">
    .flag {
        border-radius: 0.25rem;
    }
</style>
