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
        wide?: boolean;
        center?: boolean;
        primary?: boolean;
        secondary?: boolean;
        danger?: boolean;
        approve?: boolean;
        layout?: "row" | "column";
        children?: Snippet;
    } & HTMLButtonAttributes &
        HTMLAnchorAttributes;

    let {
        href,
        icon,
        iconRight,
        element = $bindable(),
        disabled = false,
        wide = false,
        center = false,
        primary = false,
        secondary = false,
        danger = false,
        approve = false,
        layout = "row",
        children,
        ...restProps
    }: Props = $props();
</script>

{#if href}
    <a
        bind:this={element}
        {href}
        {...restProps}
        class:disabled
        class:wide
        class:center
        class:primary
        class:secondary
        class:danger
        class:approve
        class:column={layout == "column"}
    >
        {@render icon?.()}
        <span>{@render children?.()}</span>
        {@render iconRight?.()}
    </a>
{:else}
    <button
        bind:this={element}
        {...restProps}
        {disabled}
        class:disabled
        class:wide
        class:center
        class:secondary
        class:primary
        class:danger
        class:approve
        class:column={layout == "column"}
    >
        {@render icon?.()}
        <span>{@render children?.()}</span>
        {@render iconRight?.()}
    </button>
{/if}

<style lang="scss">
    a,
    button {
        background-color: var(--ghost);
        color: var(--ghost-text);
        border: var(--ghost-border);
        border-radius: 10px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: inherit;
        display: inline-flex;
        align-items: center;
        text-align: center;
        gap: 0.5rem;

        white-space: nowrap;
        user-select: none;
        flex-wrap: nowrap;

        &.column {
            flex-direction: column;
        }

        text-decoration: none !important;

        transition:
            background-color 0.3s ease,
            border-radius 0.3s ease;

        &.center {
            justify-content: center;
        }

        &.wide {
            width: 100%;
        }

        &:active,
        &:hover {
            background-color: var(--ghost-hover);
            border-radius: 7px;
        }

        &.active {
            border-radius: 5px;
            background-color: var(--ghost-active);
        }

        &.primary {
            background-color: var(--primary);
            color: var(--primary-text);
            border: var(--primary-border);

            &:active,
            &:hover {
                background-color: var(--primary-hover);
            }

            &.active {
                background-color: var(--primary-active);
            }
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

    @media (max-width: 768px) {
        a,
        button {
            padding: 0.25rem 0.5rem;
        }
    }
</style>
