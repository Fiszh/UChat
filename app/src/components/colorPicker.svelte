<script lang="ts">
    import { dev } from "$app/env";
    import { onMount } from "svelte";
    import tinycolor from "tinycolor2";
    import Button from "./Inputs/Button.svelte";
    import { t } from "svelte-i18n";
    import { isMobile } from "$stores/global";

    let mainEl: HTMLElement;

    type Props = {
        /** Hex Color (#ff0000) */
        color: string;
        /** 0-360 (0) */
        hue?: number;
        /** 0.00-1.00 (1) */
        brightness?: number;
        /** 0-100 (100) */
        saturation?: number;

        offsetX?: number;
        offsetY?: number;

        onchange?: (hex: string) => void;
        clickoff?: () => void;
    };

    interface Selector {
        button?: HTMLButtonElement;
        selection?: HTMLElement;
        offset: {
            y: number;
            x: number;
        };
    }

    let {
        color = $bindable<string>("#ff0000"),
        hue = $bindable(0),
        brightness = $bindable(1),
        saturation = $bindable(100),
        offsetX = $bindable(),
        offsetY = $bindable(),
        onchange,
        clickoff,
    }: Props = $props();

    console.log(color);

    let timeout: ReturnType<typeof setTimeout> | undefined = $state();

    function handleChange() {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => onchange?.(color), 25);
    }

    const relative =
        typeof offsetX == "undefined" && typeof offsetY == "undefined";

    let selector: Selector = {
        button: undefined,
        selection: undefined,
        offset: {
            y: 0,
            x: 100,
        },
    };

    const initialColor = tinycolor(color).toHsv();

    console.log(initialColor);

    hue = Number.isNaN(initialColor.h) ? 0 : Math.round(initialColor.h);
    brightness = Math.round(initialColor.v * 100) / 100;
    saturation = Math.round(initialColor.s * 100);

    let defaultValues = {
        color,
        hue,
        saturation,
        brightness,
    };

    function reset() {
        if (color == defaultValues["color"]) return;

        color = defaultValues["color"];
        hue = defaultValues["hue"];
        saturation = defaultValues["saturation"];
        brightness = defaultValues["brightness"];
        selector["offset"]["y"] = reversedBrightness / 100;
        selector["offset"]["x"] = saturation / 100;
        handleChange();
    }

    const reversedBrightness = $derived(Math.round((1 - brightness) * 100));
    // svelte-ignore state_referenced_locally
    selector["offset"]["y"] = reversedBrightness / 100;
    selector["offset"]["x"] = saturation / 100;

    const h = $derived(hue ?? 0);
    const s = $derived(saturation ?? 0);
    const v = $derived(brightness ?? 1);

    $effect(() => {
        const newColor = tinycolor({ h, s: s / 100, v }).toHexString();

        if (color !== newColor) {
            color = newColor;
            handleChange();
        }
    });

    function updateSelection(e: PointerEvent) {
        const rect = selector.selection!.getBoundingClientRect();
        const x = Math.min(
            1,
            Math.max(0, (e.clientX - rect.left) / rect.width),
        );
        const y = Math.min(
            1,
            Math.max(0, (e.clientY - rect.top) / rect.height),
        );
        saturation = Math.round(x * 100);
        brightness = Math.round((1 - y) * 100) / 100;
    }

    const hide = () => clickoff?.();

    function clickedOff(e: MouseEvent) {
        if (mainEl.contains(e.target as Node)) return;
        hide?.();
    }

    const pressESC = (e: KeyboardEvent) => {
        if (e.code == "Escape") hide?.();
    };

    onMount(() => {
        defaultValues = {
            color,
            hue,
            saturation,
            brightness,
        };

        setTimeout(() => {
            document.body.addEventListener("click", clickedOff);
            document.addEventListener("scroll", hide, {
                capture: true,
            });
            document.body.addEventListener("keypress", pressESC);
        }, 25);
        return () => {
            document.body.removeEventListener("click", clickedOff);
            document.removeEventListener("scroll", hide, true);
            document.body.removeEventListener("keypress", pressESC);
        };
    });

    $effect(() => {
        selector["offset"]["y"] = reversedBrightness / 100;
        selector["offset"]["x"] = saturation / 100;
    });
</script>

<div
    style="
    --color: {color};
    --color-hue: hsl({hue} 100% 50%);
    --brightness: {brightness};
    --hue: {hue};
    --top: {selector['offset']['y'] * 100}%;
    --left: {selector['offset']['x'] * 100}%;
    top: {offsetY}%;
    left: {offsetX}%;"
    class:relative={relative && !$isMobile}
    class:mobile={$isMobile}
    bind:this={mainEl}
>
    <section>
        <span
            id="selection"
            role="none"
            bind:this={selector["selection"]}
            onpointerdown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                updateSelection(e);
            }}
            onpointermove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    updateSelection(e);
                }
            }}
            onpointerup={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
            onpointercancel={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }}
        >
            <button id="selector" aria-label="selector"></button>
            <span id="display"></span>
        </span>
        <span id="preview" style="background-color: {color};"></span>
    </section>
    <input type="range" id="hue" max="360" min="0" bind:value={hue} />
    <input
        type="range"
        id="brightness"
        max="1"
        min="0"
        step="0.01"
        bind:value={brightness}
    />
    <input
        type="range"
        id="saturation"
        max="100"
        min="0"
        bind:value={saturation}
    />
    <Button secondary center compact onclick={reset}>
        {$t("labels.reset")}
    </Button>
    {#if dev}
        <span id="dev-info">
            <small>c:{color}</small>
            <small>h:{hue}</small>
            <small>b:{brightness}</small>
            <small>s:{saturation}</small>
        </span>
    {/if}
</div>

<style lang="scss">
    div {
        display: flex;

        position: fixed;
        transform: translate(-50%, -100%);

        &.mobile {
            transform: translate(-50%, -50%);
        }

        z-index: 10;

        &.relative {
            position: relative;
            transform: unset;
        }

        flex-direction: column;

        height: fit-content;
        padding: 0.75rem;
        box-sizing: border-box;

        gap: 0.75rem;

        background-color: #111111;

        border-radius: 1rem;
    }

    #dev-info {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.25);
    }

    section {
        display: flex;
        flex-direction: row;

        gap: inherit;

        #preview {
            min-width: 1rem;
            border-radius: 0.25rem;
        }
    }

    #selection {
        height: 10rem;
        aspect-ratio: 1/1;
        position: relative;
        display: flex;
        width: 100%;
        touch-action: none;

        #display {
            width: 100%;
            height: 100%;
            aspect-ratio: 1/1;
            background:
                linear-gradient(
                    0deg,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(0, 0, 0, 0) 100%
                ),
                linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 1) 0%,
                    rgba(255, 255, 255, 0) 100%
                );
            background-color: hsl(var(--hue), 100%, 50%);
            border-radius: 0.5rem;
            filter: brightness(var(--brightness));
            pointer-events: none;
        }

        cursor: crosshair;

        #selector {
            height: 0.75rem;
            aspect-ratio: 1;
            background-color: var(--color);
            border-radius: 1rem;
            outline: #ffffff solid 0.1rem;
            cursor: grab;
            pointer-events: none;

            &:active {
                cursor: grabbing;
            }

            position: absolute;
            top: clamp(0%, var(--top), 100%);
            left: clamp(0%, var(--left), 100%);
            transform: translate(-50%, -50%);
            z-index: 1;
        }
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: grab;

        &:hover {
            &::-webkit-slider-thumb {
                background-color: #dfdfdf;
            }
        }

        &:active {
            cursor: grabbing;
        }
    }

    input[type="range"]:focus {
        outline: none;
    }

    input[type="range"] {
        background-color: var(--color-hue);
        border-radius: 0.5rem;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background-color: #ffffff;
        border-radius: 0.2rem;
        height: 1rem;
        width: 0.5rem;
        transform: scaleY(1.25);
    }

    #hue {
        background: linear-gradient(
            90deg,
            hsl(0 100% 50%) 0%,
            hsl(60 100% 50%) 16.67%,
            hsl(120 100% 50%) 33.33%,
            hsl(180 100% 50%) 50%,
            hsl(240 100% 50%) 66.67%,
            hsl(300 100% 50%) 83.33%,
            hsl(360 100% 50%) 100%
        );
    }

    #brightness {
        background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 1) 0%,
            var(--color-hue) 100%
        );
    }

    #saturation {
        background: linear-gradient(90deg, #ffffff 0%, var(--color-hue) 100%);
    }

    @media (max-width: 768px) {
        div {
            top: 50% !important;
            left: 50% !important;
            width: 75%;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
        }
    }
</style>
