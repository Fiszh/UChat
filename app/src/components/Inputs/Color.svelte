<script lang="ts">
    type Props = {
        value?: string;
        onChange?: (value: string) => void;
    };

    let { value = $bindable("#FFFFFF"), onChange }: Props = $props();

    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        onChange?.(target.value);
    }
</script>

<label>
    <span style="background-color: {value};"></span>
    <input type="color" bind:value onchange={handleChange} />
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
        background-color: #1b1b1b;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;

        cursor: pointer;

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
