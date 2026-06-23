<script lang="ts">
    import type { Setting } from "$stores/settings";
    import type { Snippet } from "svelte";

    type Props = {
        name: string;
        description?: string;
        settingsDefault?: Setting["default"];
        column?: boolean;
        hidden?: boolean;
        children: Snippet;
    };

    const {
        name,
        description,
        settingsDefault,
        column,
        hidden,
        children,
    }: Props = $props();
</script>

<div class:column class:hidden>
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
        position: relative;

        padding: 0.75rem 1rem;
        box-sizing: border-box;

        gap: 0.5rem;

        &.column {
            flex-direction: column;
            align-items: flex-start;
        }

        &.hidden {
            border: 1px solid red;

            &::after {
                content: "hidden";
                position: absolute;
                right: 0;
                bottom: 0;
                z-index: 1000000;
                padding-inline: 0.25rem;
                border-radius: 0.25rem 0 0 0;

                font-size: 0.75rem;

                border-top: 1px solid red;
                border-left: 1px solid red;
                background-color: rgba(255, 0, 0, 0.151);
            }
        }

        aside {
            display: flex;
            flex-direction: column;

            max-width: 75%;

            small {
                font-size: 0.75rem;
                color: var(--text-light);
            }
        }
    }
</style>
