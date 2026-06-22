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
        children?: Snippet;
    } & HTMLButtonAttributes &
        HTMLAnchorAttributes;

    const { href, icon, iconRight, children, ...restProps }: Props = $props();
</script>

{#if href}
    <a {href} {...restProps}>
        {@render icon?.()}
        {@render children?.()}
        {@render iconRight?.()}
    </a>
{:else}
    <button {...restProps}>
        {@render icon?.()}
        {@render children?.()}
        {@render iconRight?.()}
    </button>
{/if}

<style lang="scss">
    a,
    button {
        background-color: #191919;
        border: none;
        color: white;
        border-radius: 10px;
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;

        transition:
            background-color 0.2s ease,
            border-radius 0.2s ease;

        &:active,
        &:hover {
            background-color: #1c1c1c;
            border-radius: 5px;
        }

        &.active {
            background-color: #252525;
            border-radius: 3px;
        }
    }
</style>
