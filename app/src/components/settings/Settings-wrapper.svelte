<script lang="ts">
    import Button from "$components/Inputs/Button.svelte";
    import type { Setting } from "$stores/settings";
    import { RotateCcw } from "@lucide/svelte";
    import type { Snippet } from "svelte";

    type Props = {
        name: string;
        description?: string;
        onReset?: () => void;
        value?: Setting["value"];
        settingsDefault?: Setting["default"];
        column?: boolean;
        hidden?: boolean;
        children: Snippet;
    };

    const {
        name,
        description,
        onReset,
        value,
        settingsDefault,
        column,
        hidden,
        children,
    }: Props = $props();
</script>

<div class:column class:hidden>
    <aside>
        <span>
            <p>
                {@html name}
            </p>

            {#if settingsDefault != value}
                <button onclick={onReset} title="Reset">
                    <RotateCcw size="1rem" />
                </button>
            {/if}
        </span>
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

        button {
            color: white;
        }

        &.column {
            flex-direction: column;
            align-items: flex-start;
        }

        span {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }

        &.hidden {
            border: 1px solid red;

            aside p::before {
                content: "hidden";
                padding-inline: 0.25rem;
                border-radius: 0.25rem;

                margin-right: 0.25rem;

                font-size: 0.75rem;

                border: 1px solid red;
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
