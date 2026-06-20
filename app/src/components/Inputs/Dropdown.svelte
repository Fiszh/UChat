<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";
    import { ChevronDown, ChevronUp } from "lucide-svelte";

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
        {#if (!expanded && !reversed) || (expanded && reversed)}
            <ChevronDown size="1rem" />
        {:else}
            <ChevronUp size="1rem" />
        {/if}
    </button>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span id="dropdown" onclick={() => expanded && close}>
        {@render dropdown?.()}
    </span>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: column;
        background-color: #1b1b1b;
        padding: 0.5rem;

        border-radius: 10px;

        position: relative;

        cursor: pointer;

        #dropdown {
            display: flex;
            flex-direction: column;

            padding-inline: 0.5rem;
            box-sizing: border-box;

            z-index: 9999;

            max-height: 0px;
            overflow: hidden;

            position: absolute;
            left: 0;

            border-radius: 0px 0px 10px 10px;

            background-color: #1b1b1b;

            width: 100%;
        }

        &:not(.reversed) #dropdown {
            top: 100%;
        }

        &.reversed #dropdown {
            bottom: 100%;
        }

        &.expanded {
            &:not(.reversed) {
                border-radius: 10px 10px 0px 0px;

                #dropdown {
                    border-top: #1f1f1f 2px solid;

                    max-height: unset;
                }
            }

            &.reversed {
                border-radius: 0px 0px 10px 10px;

                #dropdown {
                    border-radius: 10px 10px 0px 0px;

                    border-bottom: #1f1f1f 2px solid;

                    max-height: unset;
                }
            }
        }
    }

    #top {
        background: none;
        border: none;
        color: white;
        display: inline-flex;
        align-items: center;
        font-size: inherit;
        cursor: inherit;
        gap: 0.5rem;
    }
</style>
