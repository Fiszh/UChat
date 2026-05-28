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
    {#if window.self !== window.top && document.referrer}
        <p id="embed-warning">
            <span>EMBED OF:</span>
            <a href={window.location.host} target="_blank"
                >{window.location.host}</a
            >
        </p>
    {/if}

    {#if window.self !== window.top && !document.referrer}
        <div id="embed-block">
            <h1>EMBED METHOD NOT ALLOWED</h1>
            <span
                >If you are the owner of this website, please add a referrer.</span
            >
            <span>Check out UChat:</span>
            <a href="https://{window.location.host}" target="_blank"
                >{window.location.host}</a
            >
        </div>
    {:else}
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

    #embed-block {
        position: absolute;
        width: 100%;
        height: 100%;

        background-color: rgb(111, 20, 20);
        font-weight: bolder;

        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
    }

    #embed-warning {
        position: absolute;
        z-index: 10000000000000;
        right: 8px;
        bottom: 8px;
        font-weight: bolder;
        background-color: #141414e1;
        padding: 7px 10px;
        white-space: nowrap;
        border-radius: 16px;
        font-size: 1rem;
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column;
            overflow: hidden;
        }
    }
</style>
