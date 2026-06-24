<script lang="ts">
    type Props = {
        value?: string;
        onChange?: (value: string) => void;
    };

    let { value = $bindable("#FFFFFF"), onChange }: Props = $props();

    const timeoutMS = 25;

    let timeout: ReturnType<typeof setTimeout> | undefined = $state();

    function handleChange(event: Event) {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            const target = event.target as HTMLInputElement;
            onChange?.(target.value);
        }, timeoutMS);
    }
</script>

<label>
    <span id="display" style="background-color: {value};"></span>
    <input
        type="color"
        bind:value
        oninput={handleChange}
        onchange={handleChange}
    />
    <span class="value">{value}</span>
</label>

<style lang="scss">
    input {
        width: 0rem;
        height: 0rem;
        opacity: 0;
    }

    label {
        display: inline-flex;
        align-items: center;
        gap: 0.15rem;
        background-color: var(--secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;

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
        display: inline-block;
        min-width: 7ch;
        max-width: 12ch;
        font-family: monospace;
    }
</style>
