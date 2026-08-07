<script lang="ts">
    import type { Setting } from "$stores/settings";
    import { RotateCcw } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import { t } from "svelte-i18n";

    type Props = {
        onReset?: () => void;
        value?: Setting["value"];
        settingsDefault?: Setting["default"];
        column?: boolean;
        hidden?: boolean;
        param: string;
        children: Snippet;
    };

    const {
        onReset,
        value,
        settingsDefault,
        column,
        hidden,
        param,
        children,
    }: Props = $props();
</script>

<div class:column class:hidden>
    <aside>
        <span>
            <p>
                <span id="hidden">{$t("settings.hidden")}</span>
                {$t("settings.items." + param + ".name")}
            </p>

            {#if settingsDefault != value}
                <button onclick={onReset} title="Reset">
                    <RotateCcw size="1rem" />
                </button>
            {/if}
        </span>
        <small>{$t("settings.items." + param + ".description")}</small>
    </aside>

    {@render children()}
</div>

<style lang="scss">
    div {
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        min-height: min-content;

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

        #hidden {
            display: none;
        }

        &.hidden {
            border: 1px solid red;

            #hidden {
                display: unset;

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
