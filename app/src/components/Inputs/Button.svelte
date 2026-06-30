<script lang="ts">
    import { isMobile } from "$stores/global";
    import { ExternalLink } from "@lucide/svelte";
    import { onMount, type Snippet } from "svelte";
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
        noHover?: boolean;
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
        noHover = false,
        children,
        ...restProps
    }: Props = $props();

    let isOffSite = $state(false);

    onMount(() => {
        if (
            href &&
            !href.startsWith(window.location.origin) &&
            href.startsWith("https")
        ) {
            isOffSite = true;

            const HREF_URL = new URL(href);

            HREF_URL.searchParams.append("referrer", window.location.hostname);

            href = HREF_URL.toString();
        }
    });
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
        class:noHover
        class:column={layout == "column"}
    >
        <span>{@render icon?.()}</span>
        <span>{@render children?.()}</span>
        <span>
            {#if !iconRight && isOffSite && !$isMobile}
                <ExternalLink />
            {:else}
                {@render iconRight?.()}
            {/if}
        </span>
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
        class:noHover
        class:column={layout == "column"}
    >
        <span>{@render icon?.()}</span>
        <span>{@render children?.()}</span>
        <span>{@render iconRight?.()}</span>
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

        &:not(.center):has(> *:nth-child(3)) > *:nth-child(2) {
            width: 100%;
            text-align: left;
        }

        &.column {
            flex-direction: column;
        }

        span:empty {
            display: none;
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

        &:not(.noHover) {
            &:active,
            &:hover {
                background-color: var(--ghost-hover);
                border-radius: 7px;
            }

            &.active {
                border-radius: 5px;
                background-color: var(--ghost-active);
            }
        }

        &.primary {
            background-color: var(--primary);
            color: var(--primary-text);
            border: var(--primary-border);

            &:not(.noHover) {
                &:active,
                &:hover {
                    background-color: var(--primary-hover);
                }

                &.active {
                    background-color: var(--primary-active);
                }
            }
        }

        &.secondary {
            background-color: var(--secondary);
            color: var(--secondary-text);
            border: var(--secondary-border);

            &:not(.noHover) {
                &:active,
                &:hover {
                    background-color: var(--secondary-hover);
                }

                &.active {
                    background-color: var(--secondary-active);
                }
            }
        }

        &.danger {
            background-color: var(--danger);
            color: var(--danger-text);
            border: var(--danger-border);

            &:not(.noHover) {
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
        }

        &.approve {
            background-color: var(--approve);
            color: var(--approve-text);
            border: var(--approve-border);

            &:not(.noHover) {
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
    }

    @media (max-width: 768px) {
        a,
        button {
            padding: 0.25rem 0.5rem;
        }
    }
</style>
