<!-- SOME PARTS ARE FROM https://github.com/SevenTV/SevenTV/blob/main/apps/website/src/components/input/segmented-control.svelte -->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { crossfade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    type Option = {
        enabled: boolean;
        label?: string;
        icon?: Snippet;
    };

    type Props = {
        options: Option[];
    };

    const [send, receive] = crossfade({
        duration: 200,
        easing: cubicInOut,
    });

    let { options = [] }: Props = $props();
</script>

<section>
    {#each options as option}
        <label class:enabled={option.enabled}>
            <input type="checkbox" bind:checked={option.enabled} />
            {@render option?.icon?.()}
            {#if option.label}
                <p>{option.label}</p>
            {/if}
        </label>
    {/each}
</section>

<style lang="scss">
    input {
        display: none;
    }

    section {
        display: flex;
        background-color: #1b1b1b;

        gap: 0.25rem;
        padding: 0.35rem;
        border-radius: 0.5rem;

        user-select: none;

        label {
            border: none;
            color: white;
            position: relative;

            gap: 0.25rem;

            opacity: 0.5;
            background-color: #262626;

            &.enabled {
                opacity: 1;
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

            p {
                margin: 0;
            }
        }
    }
</style>
