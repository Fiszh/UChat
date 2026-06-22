<!-- SOME PARTS ARE FROM https://github.com/SevenTV/SevenTV/blob/main/apps/website/src/components/input/segmented-control.svelte -->

<script lang="ts">
    import { onMount } from "svelte";
    import type { Snippet } from "svelte";
    import { crossfade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    interface Option {
        id: string;
        label?: string;
        icon?: Snippet;
    }

    type Props = {
        value?: string;
        options: Option[];
    };

    const [send, receive] = crossfade({
        duration: 200,
        easing: cubicInOut,
    });

    let { value = "", options = [] }: Props = $props();

    onMount(() => {
        value = options[0]["id"];
    });
</script>

<section>
    {#each options as { id, label, icon }}
        <button
            data-id={id}
            class:selected={value == id}
            onclick={() => (value = id)}
        >
            {@render icon?.()}
            {#if label}
                <p>{label}</p>
            {/if}
            {#if value == id}
                <div
                    class="slider"
                    in:receive={{ key: "slider" }}
                    out:send={{ key: "slider" }}
                ></div>
            {/if}
        </button>
    {/each}
</section>

<style lang="scss">
    section {
        display: flex;
        background-color: #1b1b1b;

        gap: 0.25rem;
        padding: 0.35rem;
        border-radius: 0.5rem;

        user-select: none;

        button {
            background: none;
            border: none;
            color: white;
            position: relative;

            font-weight: bold;

            gap: 0.25rem;

            opacity: 0.75;

            &.selected {
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

            p {
                margin: 0;
            }
        }
    }

    .slider {
        position: absolute;
        inset: 0;
        background-color: #262626;
        border-radius: 0.25rem;
        z-index: -1;
    }
</style>
