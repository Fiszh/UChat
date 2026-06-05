<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "$components/Main/Sidebar.svelte";

    import "app.scss";

    import { page } from "$app/state";
    import { overlayVersion } from "$stores/settings";
    import { getVersion } from "$lib/overlayIndex";
    import Banner from "$components/Banner.svelte";

    let { data, children } = $props();

    let mounted = $state<boolean>(false);
    let hasChannel = $state<boolean>(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        hasChannel = params.has("channel") || params.has("id");

        (async () => {
            overlayVersion.set(await getVersion());
        })();

        mounted = true;
    });
</script>

{#if mounted}
    {#if !hasChannel}
        {#if data.statusMessage == null}
            <Banner type="fail" />
        {:else if data.statusMessage && (data.statusMessage.type || data.statusMessage.message)}
            <Banner {...data.statusMessage} />
        {/if}
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

<noscript style="color:black;">
    <div>
        <h1>JavaScript is disabled</h1>
        <p>This app requires JavaScript to work.</p>
        <p>Enable JavaScript to use the app.</p>
    </div>
</noscript>

<style>
    main {
        display: flex;
        width: 100%;
        height: 100%;

        overflow: hidden;

        background: linear-gradient(#080808, #000000);
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column;
            overflow: hidden;
        }
    }
</style>
