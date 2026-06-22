<script lang="ts">
    import { X } from "@lucide/svelte";
    import type { Snippet } from "svelte";
    import Button from "./Inputs/Button.svelte";

    type Props = {
        name: string;
        show: boolean;
        buttons?: Snippet;
        children: Snippet;
    };

    let { name, show = $bindable(false), buttons, children }: Props = $props();

    const close = () => (show = false);
</script>

{#if show}
    <section class="dialog">
        <span id="header">
            <p>{name}</p>
            <Button ghost onclick={close}><X /></Button>
        </span>
        <hr />
        <section id="content">{@render children()}</section>
        {#if typeof buttons != "undefined"}
            <hr />
            <section id="buttons">{@render buttons()}</section>
        {/if}
    </section>
    <section id="site-blackout"></section>
{/if}

<style lang="scss">
    #site-blackout {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100000;
        background-color: #0a0a0a;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);

        // overflow: hidden;

        display: flex;
        flex-direction: column;
        max-width: 30rem;
        max-height: 25rem;

        border-radius: 1rem;

        & > *:not(hr) {
            padding: 0.75rem;
            // outline: 1px red solid;
        }

        #header {
            margin: 0;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            user-select: none;
        }

        #buttons {
            display: inline-flex;
            justify-content: space-between;

            padding-block: 0.5rem;

            & > :global(*) {
                display: inline-flex;
                gap: 0.5rem;
            }
        }
    }

    @media (max-width: 768px) {
        .dialog {
            max-width: unset;
            max-height: unset;

            border-radius: unset;

            width: 100%;
            height: 100%;
        }
    }
</style>
