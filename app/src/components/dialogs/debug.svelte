<script lang="ts">
    import Dialog from "#components/Dialog.svelte";
    import Button from "#components/Inputs/Button.svelte";
    import { debugInfo } from "#stores/debugDialog.ts";

    let show = $state(false);

    $effect(() => {
        if (!show) $debugInfo != null;
    });

    debugInfo.subscribe((v) => {
        show = v != null;
    });
</script>

<Dialog name="Debug UI" bind:show>
    <div id="layout">
        <div id="images">
            {#each $debugInfo?.images?.filter(Boolean) as image}
                {#if image}
                    <span class="img">
                        {#if typeof image == "string"}
                            <img src={image} alt="img" />
                        {:else}
                            {@render image()}
                        {/if}
                    </span>
                {/if}
            {/each}
        </div>
        <div id="info">
            {#each $debugInfo?.info as info}
                <p>{info}</p>
            {/each}
        </div>
        <Button secondary onclick={() => (show = false)}>Close</Button>
    </div>
</Dialog>

<style lang="scss">
    #layout {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        justify-content: center;
        text-align: center;

        #images {
            overflow-x: auto;
            overflow-y: hidden;
            display: flex;
            justify-content: center;
            align-items: center;

            min-height: 5rem;
        }

        .img {
            max-height: 5rem;

            img {
                object-fit: contain;
                height: 5rem;
            }
        }
    }
</style>
