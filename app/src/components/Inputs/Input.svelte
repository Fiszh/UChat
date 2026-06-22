<script lang="ts">
    import type { Snippet } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLAnchorAttributes,
    } from "svelte/elements";

    import { X, Ban } from "lucide-svelte";
    import { fade } from "svelte/transition";

    type Props = {
        icon?: Snippet;
        iconRight?: Snippet;
        children?: Snippet;
        value?: string;
        disabled?: boolean;
        invalid?: boolean;
    } & HTMLInputAttributes &
        HTMLAnchorAttributes;

    let {
        icon,
        iconRight,
        value = $bindable(""),
        disabled = false,
        invalid = false,
        ...restProps
    }: Props = $props();

    const clear = () => {
        value = "";
        invalid = false;
    };
</script>

<label class:disabled class:invalid>
    {#if !disabled}
        {@render icon?.()}
    {:else}
        <Ban size="1rem" color="currentColor" />
    {/if}
    <input
        {...restProps}
        bind:value
        {disabled}
        placeholder={disabled ? "Disabled" : restProps.placeholder}
    />
    {#if !disabled}
        <span id="rightIcon" transition:fade>
            {#if iconRight && !value.length && !invalid}
                {@render iconRight()}
            {:else if value.length || invalid}
                <button title="Clear" onclick={clear}><X size="1rem" /></button>
            {/if}
        </span>
    {/if}
</label>

<style lang="scss">
    label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        background-color: #1b1b1b;

        border: 0.15rem #242424 solid;
        border-radius: 0.25rem;
        padding: 0.25rem;

        cursor: text;

        &:hover {
            background-color: #282828;
            border-color: #5c5c5c;
        }

        &:focus-within {
            border-color: #cfcfcf;
        }

        &.invalid {
            border-color: #e23636;
        }

        &.disabled {
            background-color: #1d1d1d;
            border-color: #151515;
            color: #363636;

            cursor: not-allowed;

            &::placeholder {
                color: #363636;
            }
        }

        span,
        button {
            background-color: transparent;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0rem;
            display: inline-flex;
        }

        span {
            height: 1rem;
            aspect-ratio: 1;
            cursor: unset;
        }

        input {
            background-color: transparent;
            border: none;
            color: white;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            cursor: inherit;

            &:focus {
                outline: none;
            }
        }
    }
</style>
