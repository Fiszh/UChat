<script lang="ts">
    import { dev } from "$app/env";
    import UChat from "./logos/uchat.svelte";
    import Version from "./version.svelte";

    type Props = {
        title?: string;
    };

    let { title }: Props = $props();
</script>

<topbar class:title>
    <UChat size="2.5rem" brandColor={dev} pride />
    <span>
        <p id="branding">
            UChat
            <small><Version /></small>
        </p>
        {#if typeof title == "string" && title.length}
            <p id="title">{title}</p>
        {/if}
    </span>
</topbar>

<style lang="scss">
    topbar {
        border-bottom: #242424 1px solid;

        padding: 0.25rem 0.5rem;
        box-sizing: border-box;

        display: flex;
        align-items: center;
        gap: 0.5rem;

        #branding {
            font-weight: bold;
            display: flex;
            flex-direction: column;

            small {
                font-weight: normal;
                color: rgba(255, 255, 255, 0.35);
            }
        }

        &.title #branding {
            display: unset;
        }
    }

    small,
    #title {
        font-size: 0.65rem;
    }
</style>
