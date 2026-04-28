<script lang="ts">
    import { X } from "lucide-svelte";

    let { name, show = false, ref = $bindable(null), children } = $props();

    const close = () => (show = false);
</script>

{#if show}
    <section class="dialog" bind:this={ref}>
        <h3>{name} <button onclick={close}><X /></button></h3>

        {@render children()}
    </section>
    <section id="site-blackout" role="presentation" onclick={close}></section>
{/if}

<style lang="scss">
    #site-blackout {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.25);
        z-index: 999;
        cursor: pointer;
    }

    .dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100000;
        background-color: rgb(17, 17, 17);

        display: flex;
        flex-direction: column;

        overflow: hidden;

        gap: 0.7rem;

        max-width: 55rem;
        max-height: 50rem;

        padding: 0.4rem 0.7rem;

        border-radius: 0.5rem;

        border: 0.15rem dashed #1b1b1b;

        h3 {
            margin: 0;
            display: flex;
            justify-content: space-between;
            user-select: none;
            padding-bottom: 0.2rem;

            border-bottom: 1px #242424 solid;

            button {
                background: none;
                border: none;
                cursor: pointer;

                color: white;

                &:hover {
                    color: rgba(255, 255, 255, 0.75);
                }
            }
        }
    }

    @media (max-width: 768px) {
        .dialog {
            width: 80%;
        }
    }
</style>
