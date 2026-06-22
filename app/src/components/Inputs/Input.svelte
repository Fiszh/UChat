<script lang="ts">
    import type { Snippet } from "svelte";
    import type {
        HTMLInputAttributes,
        HTMLAnchorAttributes,
    } from "svelte/elements";

    import { X, Ban } from "@lucide/svelte";
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

        background-color: var(--secondary);

        border: 0.15rem var(--secondary-active) solid;
        border-radius: 0.25rem;
        padding: 0.25rem;

        cursor: text;

        &:hover {
            background-color: var(--secondary-active);
            border-color: var(--text-light);
        }

        &:focus-within {
            border-color: var(--text-light);
        }

        &.invalid {
            border-color: var(--danger-hover);
        }

        span,
        button {
            background-color: transparent;
            border: none;
            color: currentColor;
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
            color: currentColor;

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
