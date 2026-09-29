<script lang="ts">
    import type { Snippet } from "svelte";

    type Props =
        | {
              badge_url: string;
              alt: string;
              background_color: string;
              children?: never;
          }
        | {
              badge_url?: never;
              alt?: never;
              background_color?: never;
              children: Snippet;
          };

    const { badge_url, alt, background_color, children }: Props = $props();
</script>

{#if typeof children == "undefined"}
    <img
        class="badge"
        style="background-color: {background_color || 'transparent'};"
        src={badge_url}
        {alt}
        loading="lazy"
    />
{:else}
    <span class="badge">
        {@render children()}
    </span>
{/if}

<style>
    :global {
        .badge > *,
        .badge {
            height: var(--chat-font-size);
            width: var(--chat-font-size);
            object-fit: contain;
        }
    }
</style>
