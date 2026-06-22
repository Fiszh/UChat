<script lang="ts">
    let { checked = $bindable(false), disabled = false } = $props();
</script>

<label>
    <input type="checkbox" bind:checked {disabled} />
</label>

<style lang="scss">
    input {
        --size: 2rem;

        appearance: none;
        position: relative;
        width: calc(var(--size) * 2);
        height: var(--size);
        background-color: #272727;
        border-radius: 100rem;
        cursor: pointer;
        transition: background-color 0.2s ease;

        &::after {
            content: "";
            position: absolute;
            width: calc(var(--size) - 4px);
            height: calc(var(--size) - 4px);
            background: #737373;
            border-radius: 50%;
            top: 50%;
            left: 2px;
            transform: translateY(-50%);
            transition:
                left 0.2s ease,
                background-color 0.25s ease;
        }

        &:checked {
            background-color: #3d8445;

            &::after {
                background: white;
                left: calc(100% - var(--size) + 2px);
            }
        }

        &[disabled] {
            cursor: not-allowed;
            background-color: #1c1c1c;

            &::after {
                background-color: #414141;
            }
        }
    }
</style>
