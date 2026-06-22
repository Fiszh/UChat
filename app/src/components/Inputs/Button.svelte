<script lang="ts">
    import type { Snippet } from "svelte";
    import type {
        HTMLButtonAttributes,
        HTMLAnchorAttributes,
    } from "svelte/elements";

    type Props = {
        href?: string | null;
        icon?: Snippet;
        iconRight?: Snippet;
        element?: HTMLElement;
        disabled?: boolean;
        secondary?: boolean;
        ghost?: boolean;
        danger?: boolean;
        approve?: boolean;
        children?: Snippet;
    } & HTMLButtonAttributes &
        HTMLAnchorAttributes;

    let {
        href,
        icon,
        iconRight,
        element = $bindable(),
        disabled = false,
        secondary = false,
        ghost = false,
        danger = false,
        approve = false,
        children,
        ...restProps
    }: Props = $props();
</script>

{#if href}
    <a
        bind:this={element}
        {href}
        {...restProps}
        class:secondary
        class:ghost
        class:danger
        class:disabled
        class:approve
    >
        {@render icon?.()}
        {@render children?.()}
        {@render iconRight?.()}
    </a>
{:else}
    <button
        bind:this={element}
        {...restProps}
        {disabled}
        class:secondary
        class:ghost
        class:danger
        class:disabled
        class:approve
    >
        {@render icon?.()}
        {@render children?.()}
        {@render iconRight?.()}
    </button>
{/if}

<style lang="scss">
    a,
    button {
        background-color: var(--primary);
        color: var(--primary-text);
        border: var(--primary-border);
        border-radius: 10px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        text-decoration: none !important;

        transition:
            background-color 0.2s ease,
            border-radius 0.2s ease;

        &:active,
        &:hover {
            background-color: var(--primary-hover);
            border-radius: 7px;
        }

        &.active {
            background-color: var(--primary-active);
            border-radius: 5px;
        }

        &.secondary {
            background-color: var(--secondary);
            color: var(--secondary-text);
            border: var(--secondary-border);

            &:active,
            &:hover {
                background-color: var(--secondary-hover);
            }

            &.active {
                background-color: var(--secondary-active);
            }
        }

        &.ghost {
            background-color: var(--ghost);
            color: var(--ghost-text);
            border: var(--ghost-border);

            &:active,
            &:hover {
                background-color: var(--ghost-hover);
            }

            &.active {
                background-color: var(--ghost-active);
            }
        }

        &.danger {
            background-color: var(--danger);
            color: var(--danger-text);
            border: var(--danger-border);

            &:active,
            &:hover {
                background-color: var(--danger-hover);
                color: var(--danger-text-hover);
            }

            &.active {
                background-color: var(--danger-active);
                color: var(--danger-text-active);
            }
        }

        &.approve {
            background-color: var(--approve);
            color: var(--approve-text);
            border: var(--approve-border);

            &:active,
            &:hover {
                background-color: var(--approve-hover);
                color: var(--approve-text-hover);
            }

            &.active {
                background-color: var(--approve-active);
                color: var(--approve-text-active);
            }
        }
    }
</style>
