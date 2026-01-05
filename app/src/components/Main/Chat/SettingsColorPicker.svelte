<script lang="ts">
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";
    import { RotateCcw } from "lucide-svelte";

    export let hex = "#FFFFFF";
    export let onChange: ((hex: string) => void) | null = null;

    const defaultHex = hex;

    let debounceTimeout: ReturnType<typeof setTimeout>;

    function handleInput(event: any) {
        hex = event.hex;

        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (onChange) onChange(hex);
        }, 200);
    }

    function resetColor() {
        hex = defaultHex;
        if (onChange) onChange(hex);
    }
</script>

<ColorPicker
    bind:hex
    components={ChromeVariant}
    label=""
    sliderDirection="horizontal"
    isTextInput={false}
    dir="rtl"
    onInput={handleInput}
/>
<button title="Reset" on:click={resetColor}><RotateCcw /></button>

<style lang="scss">
    button {
        all: unset;
        display: flex;
        align-items: center;
        transition: all 0.2s ease-in-out;
        cursor: pointer;

        &:hover {
            transform: rotate(-30deg);
        }
    }
</style>
