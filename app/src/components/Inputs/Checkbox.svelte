<script lang="ts">
    let { checked = $bindable(false), children } = $props();
</script>

<label>
    <input type="checkbox" bind:checked />
    {@render children()}
</label>

<style lang="scss">
    label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;

        & > * {
            cursor: pointer;
        }

        &:hover input {
            background-color: var(--secondary-hover);
        }

        input {
            appearance: none;
            width: 1rem;
            aspect-ratio: 1;
            background-color: var(--secondary);

            border: 0.15rem var(--secondary-active) solid;
            border-radius: 0.25rem;
            transition: background-color 0.2s ease;

            &:checked {
                background-color: var(--accent);
                border-color: var(--secondary-active);
            }
        }
    }
</style>
