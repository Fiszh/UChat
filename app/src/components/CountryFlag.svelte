<script lang="ts" module>
    export const flags = {
        en: new URL("$assets/flags/us.svg", import.meta.url).href,
        "en-GB": new URL("$assets/flags/uk.svg", import.meta.url).href,
        "pl-PL": new URL("$assets/flags/pl.svg", import.meta.url).href,
        "en-PT": new URL("$assets/flags/en-x-pirate.svg", import.meta.url).href,
        "pt-PT": new URL("$assets/flags/pt.svg", import.meta.url).href,
        "ar-SA": new URL("$assets/flags/sa.svg", import.meta.url).href,
        "es-ES": new URL("$assets/flags/es.svg", import.meta.url).href,
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
