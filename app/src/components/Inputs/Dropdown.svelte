<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";
    import { ChevronDown, ChevronUp } from "@lucide/svelte";

    type Props = {
        dropdown?: Snippet;
        children?: Snippet;
        value?: string;
        reversed?: boolean;
    } & HTMLAttributes<HTMLDivElement>;

    let expanded = $state(false);

    let {
        dropdown,
        children,
        value,
        reversed = false,
        ...restProps
    }: Props = $props();

    const toggle = () => (expanded = !expanded);

    const handleMouseEnter = () => (expanded = true);

    const close = () => (expanded = false);

    const handleMouseLeave = close;
</script>

<div
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    class:expanded
    class:reversed
    {...restProps}
    onclick={toggle}
    role="none"
>
    <button id="top">
        {@render children?.()}
        {#if !expanded}
            <ChevronDown size="1rem" />
        {:else}
            <ChevronUp size="1rem" />
        {/if}
    </button>
    <span id="dropdown">
        {@render dropdown?.()}
    </span>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        background-color: var(--secondary);

        border-radius: 10px;

        position: relative;

        cursor: pointer;

        white-space: nowrap;

        #dropdown {
            display: flex;
            flex-direction: column;

            box-sizing: border-box;

            z-index: 9999;

            max-height: 0px;
            overflow: hidden;

            border-radius: 0px 0px 10px 10px;

            position: relative;

            min-width: fit-content;

            background-color: var(--secondary);

            width: 100%;

            overflow-y: auto;
            overflow-x: hidden;
        }

        &.expanded {
            #dropdown {
                border-top: var(--secondary-active) 2px solid;

                max-height: 20vh;
                max-height: 20dvh;
            }
            &.reversed #dropdown {
                flex-direction: column-reverse;
            }
        }
    }

    #top {
        background: none;
        border: none;
        color: currentColor;
        display: inline-flex;
        align-items: center;
        font-size: inherit;
        cursor: inherit;
        gap: 0.5rem;
        padding: 0.5rem;
    }
</style>
