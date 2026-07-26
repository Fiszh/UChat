<script lang="ts">
    import { dev } from "$app/environment";
    import { flags } from "$lib/bitmap";
    import { onMount, type Snippet } from "svelte";
    import { t } from "svelte-i18n";

    type Option = {
        enabled: boolean;
        label?: string;
        icon?: Snippet<[boolean]>;
        bitmap?: number;
        disabled?: boolean;
    };

    type Props = {
        options: Option[];
        quickOptions?: boolean;
        bitmap?: number;
        onChange?: (v: number) => void;
    };

    let {
        options = [],
        quickOptions = false,
        bitmap = 0,
        onChange,
    }: Props = $props();

    function toggleOption(i: number) {
        bitmap = flags.toggle(bitmap, i);

        onChange?.(bitmap);
    }

    function toggleAll(value: boolean) {
        if (value) {
            bitmap = flags.enableAll(options);
        } else {
            bitmap = flags.disableAll();
        }

        onChange?.(bitmap);
    }
</script>

<section>
    <div id="layout">
        {#each options as option, i}
            <label
                class:enabled={flags.isEnabled(bitmap, i)}
                title={option.disabled ? "disabled" : ""}
            >
                <input
                    type="checkbox"
                    onchange={() => toggleOption(i)}
                    disabled={option.disabled}
                />
                {@render option?.icon?.(
                    !option.disabled && flags.isEnabled(bitmap, i),
                )}
                {#if option.label}
                    <small>{option.label}</small>
                {/if}
            </label>
        {/each}
    </div>
    <span>
        {#if quickOptions}
            <button onclick={() => toggleAll(true)}>
                <small>{$t("labels.enable_all")}</small>
            </button>
            <small>{bitmap}</small>
            <button onclick={() => toggleAll(false)}>
                <small>{$t("labels.disable_all")}</small>
            </button>
        {:else if !quickOptions && dev}
            <small>{bitmap}</small>
        {/if}
    </span>
</section>

<style lang="scss">
    input {
        display: none;
    }

    #layout {
        display: flex;

        gap: 0.25rem;

        flex-wrap: wrap;
    }

    section {
        background-color: var(--secondary);
        padding: 0.35rem;
        border-radius: 0.5rem;

        user-select: none;

        overflow: hidden;

        span {
            display: flex;
            justify-content: space-between;
            align-items: center;

            &:has(> :only-child) {
                justify-content: center;
            }
        }

        button {
            color: rgb(66, 66, 66);

            transition: color 0.3s ease;

            &:hover {
                color: rgb(109, 109, 109);
            }
        }

        label {
            border: none;
            color: currentColor;
            position: relative;

            gap: 0.25rem;

            opacity: 0.5;
            background-color: var(--secondary-active);

            &.enabled {
                opacity: 1;
            }

            &:has(input[disabled]) {
                opacity: 0.25;
                color: rgba(255, 255, 255, 0.25);
                cursor: not-allowed;
            }

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            padding: 0.5rem;
            border-radius: 0.25rem;
            z-index: 1;

            cursor: pointer;

            transition: opacity 0.3s ease;

            small {
                font-size: 0.75rem;
            }
        }
    }

    @media (max-width: 768px) {
        section label {
            padding: 0.25rem;
        }
    }
</style>
