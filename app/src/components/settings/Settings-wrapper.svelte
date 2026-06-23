<script lang="ts">
    import type { Setting } from "$stores/settings";
    import type { Snippet } from "svelte";

    type Props = {
        name: string;
        description?: string;
        settingsDefault?: Setting["default"];
        children: Snippet;
    };

    const { name, description, settingsDefault, children }: Props = $props();
</script>

<div>
    <aside>
        <p>{@html name}</p>
        {#if description?.trim()?.length}
            <small>{@html description}</small>
        {/if}
    </aside>

    {@render children()}
</div>

<style lang="scss">
    div {
        display: inline-flex;
        justify-content: space-between;
        align-items: center;

        padding: 0.5rem;
        box-sizing: border-box;

        aside {
            display: flex;
            flex-direction: column;

            small {
                font-size: 0.75rem;
                color: var(--text-light);
            }
        }
    }
</style>
