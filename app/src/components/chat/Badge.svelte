<script lang="ts">
    import { debugInfo } from "#stores/debugDialog.ts";
    import type { Badges } from "#types/badges.js";
    import { onMount, type Snippet } from "svelte";

    type NoBadge = { [K in keyof Badges.parsed]?: never };

    interface BadgeNormal extends Badges.parsed {
        children?: never;
    }

    interface BadgeChildren extends NoBadge {
        children: Snippet;
    }

    type Props = BadgeNormal | BadgeChildren;

    const { badge_url, alt, background_color, children }: Props = $props();

    let badge = $state<HTMLElement>();

    if (__DEBUG__) {
        onMount(() => {
            badge?.addEventListener("click", () => {
                debugInfo.set({
                    images: [badge_url, children],
                    info: [alt, background_color],
                });
            });
        });
    }
</script>

{#if typeof children == "undefined"}
    <img
        class="badge"
        style="background-color: {background_color || 'transparent'};"
        src={badge_url}
        {alt}
        loading="lazy"
        bind:this={badge}
    />
{:else}
    <span class="badge" bind:this={badge}>
        {@render children()}
    </span>
{/if}

{#if __DEBUG__}
    <style lang="scss">
        .badge {
            cursor: pointer;

            &:hover {
                filter: brightness(1.5);
                outline: red 1px solid;
            }
        }
    </style>
{/if}

<style lang="scss">
    :global {
        .badge > *,
        .badge {
            height: var(--chat-font-size);
            width: var(--chat-font-size);
            object-fit: cover;
        }
    }
</style>
