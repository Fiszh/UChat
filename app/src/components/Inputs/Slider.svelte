<script lang="ts">
    import { onMount } from "svelte";

    function updateSliderFill() {
        const value = Number(inputEl.value);
        const min = Number(inputEl.min);
        const max = Number(inputEl.max);
        const percent = ((value - min) / (max - min)) * 100;
        inputEl.style.background = `linear-gradient(to right, #7c5cfc 0%, #7c5cfc ${percent}%, #2a2a2a ${percent}%, #2a2a2a 100%)`;
    }

    let inputEl: HTMLInputElement;
    function handleChange(e: Event) {
        updateSliderFill();

        onChange?.(e);
    }

    onMount(() => {
        updateSliderFill();
        inputEl.addEventListener("input", updateSliderFill);
    });

    type Props = {
        value: string;
        min?: string;
        max: string;
        wide?: boolean;
        displayValue?: boolean;
        onChange?: (e: Event) => void;
    };

    let {
        value,
        min = "0",
        max,
        wide,
        displayValue,
        onChange,
    }: Props = $props();

    $effect(() => {
        value;
        if (inputEl) updateSliderFill();
    });
</script>

<label class:wide>
    <input
        bind:this={inputEl}
        type="range"
        class="slider"
        {min}
        {max}
        bind:value
        onchange={handleChange}
    />
    {#if displayValue}
        <span class="value">{value}</span>
    {/if}
</label>

<style lang="scss">
    label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        width: 25%;

        &.wide {
            width: 100%;
        }

        opacity: 0.9;

        &:hover {
            opacity: unset;
        }
    }

    .value {
        display: inline-block;
        min-width: 7ch;
        max-width: 12ch;
        font-family: monospace;
        background-color: #1b1b1b;
        border: 2px #242424 solid;
        border-radius: 0.5rem;
        text-align: center;
    }

    input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 0.5rem;
        border-radius: 3px;
        background: #2a2a2a;
        cursor: pointer;
    }

    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        height: 1.5rem;
        width: 1.5rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #bdbdbd;
    }

    input::-moz-range-thumb {
        height: 1.5rem;
        width: 1.5rem;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #bdbdbd;
    }
</style>
