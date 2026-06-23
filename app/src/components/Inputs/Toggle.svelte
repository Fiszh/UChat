<script lang="ts">
    type Props = {
        checked?: boolean;
        onChange?: (e: Event) => void;
        disabled?: boolean;
    };

    let {
        checked = $bindable(false),
        onChange,
        disabled = false,
    }: Props = $props();
</script>

<label>
    <input type="checkbox" bind:checked {disabled} onchange={onChange} />
</label>

<style lang="scss">
    input {
        --size: 2rem;

        appearance: none;
        position: relative;
        width: calc(var(--size) * 2);
        height: var(--size);
        background-color: var(--secondary-active);
        border-radius: 100rem;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &::after {
            content: "";
            position: absolute;
            width: calc(var(--size) - 4px);
            height: calc(var(--size) - 4px);
            background: var(--text-light);
            border-radius: 50%;
            top: 50%;
            left: 2px;
            transform: translateY(-50%);
            transition:
                left 0.2s ease,
                background-color 0.25s ease;
        }

        &:checked {
            background-color: var(--approve-hover);

            &::after {
                background: var(--text);
                left: calc(100% - var(--size) + 2px);
            }
        }
    }
</style>
