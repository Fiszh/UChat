<script lang="ts">
    import ColorPicker from "$components/colorPicker.svelte";

    type Props = {
        value?: string;
        onChange?: (value: string) => void;
    };

    let { value = $bindable("#ffffff"), onChange }: Props = $props();

    let displayPicker = $state(false);
    let pickerOffset = $state({
        x: 0,
        y: 0,
    });

    function showPicker(e: MouseEvent) {
        pickerOffset["x"] = (e.clientX / window.innerWidth) * 100;
        pickerOffset["y"] = (e.clientY / window.innerHeight) * 100;
        displayPicker = true;
    }

    const clickoff = () => (displayPicker = false);
</script>

{#if displayPicker}
    <ColorPicker
        bind:color={value}
        bind:offsetX={pickerOffset["x"]}
        bind:offsetY={pickerOffset["y"]}
        onchange={onChange}
        {clickoff}
    />
{/if}

<button onclick={showPicker}>
    <span id="display" style="background-color: {value};"></span>
    <span class="value">{value}</span>
</button>

<style lang="scss">
    button {
        display: inline-flex;
        align-items: center;
        gap: 0.15rem;
        background-color: var(--secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;

        color: var(--color);

        cursor: pointer;

        #display {
            border: #ffffff2c 1px solid;
        }

        & > * {
            cursor: pointer;
        }
    }

    span {
        height: 1rem;
        aspect-ratio: 1;
        border-radius: 0.25rem;
    }

    .value {
        display: inline-flex;
        min-width: 7ch;
        max-width: 12ch;
        font-family: monospace;
        align-items: center;
    }

    @media (max-width: 768px) {
        button {
            #display {
                height: 0.75rem;
                border-radius: 0.15rem;
            }

            .value {
                font-size: 0.5rem;
            }
        }
    }
</style>
