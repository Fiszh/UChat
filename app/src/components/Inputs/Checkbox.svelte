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
        gap: 0.05rem;
        cursor: pointer;

        & > * {
            cursor: pointer;
        }

        &:hover input {
            background-color: #5c5c5c;
        }

        input {
            appearance: none;
            width: 1rem;
            aspect-ratio: 1;
            background-color: #474747;

            border: 0.15rem #535353 solid;
            border-radius: 0.25rem;
            transition: background-color 0.2s ease;

            &:checked {
                background-color: #7c5cfc;
                border-color: #544b7b;
            }
        }
    }
</style>
