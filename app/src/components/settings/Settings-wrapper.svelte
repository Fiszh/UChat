<script lang="ts">
    import type { Setting } from "$stores/settings";
    import { InfoIcon, RotateCcw } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import { t } from "svelte-i18n";

    type Props = {
        onReset?: () => void;
        value?: Setting["value"];
        settingsDefault?: Setting["default"];
        previewReact?: boolean;
        column?: boolean;
        hidden?: boolean;
        param: string;
        children: Snippet;
    };

    const {
        onReset,
        value,
        settingsDefault,
        previewReact,
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
        {#if typeof previewReact == "boolean" && !previewReact}
            <small id="non-reactive">
                <InfoIcon size="0.75rem" />
                {$t("settings.non_reactive")}
            </small>
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

        min-height: min-content;

        padding: 0.75rem 1rem;
        box-sizing: border-box;

        gap: 0.5rem;

        button {
            color: var(--color);
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

        #non-reactive {
            color: rgba(255, 255, 255, 0.25);
            display: inline-flex;
            align-items: center;
            gap: 0.15rem;
        }

        &.hidden {
            border: 1px dashed rgba(255, 0, 0, 0.5);
            border-radius: 0.5rem;

            #hidden {
                display: unset;

                padding-inline: 0.25rem;
                border-radius: 0.25rem;

                margin-right: 0.25rem;

                font-size: 0.75rem;

                border: 1px solid rgba(255, 0, 0, 0.25);
                background-color: rgba(255, 0, 0, 0.15);
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
