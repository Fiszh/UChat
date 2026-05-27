<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "$components/Main/Sidebar.svelte";

    import "app.scss";

    import { page } from "$app/state";
    import { overlayVersion } from "$stores/settings";
    import { getVersion } from "$lib/overlayIndex";

    let { children } = $props();

    let mounted = $state<boolean>(false);
    let hasChannel = $state<boolean>(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        hasChannel =
            params.has("channel") || params.has("id") || params.has("kick");

        (async () => {
            overlayVersion.set(await getVersion());
        })();

        mounted = true;
    });
</script>

{#if mounted}
    {#if !hasChannel}
        <main>
            {#if page.status !== 404 && page.route.id != "/auth"}
                <Sidebar />
            {/if}
            {@render children()}
        </main>
    {:else}
        {@render children()}
    {/if}
{:else}
    <main>Loading...</main>
{/if}

<style>
    main {
        display: flex;
        width: 100%;
        height: 100dvh;

        background: linear-gradient(#080808, #000000);
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column;
            overflow: hidden;
        }
    }
</style>
