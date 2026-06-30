<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "$components/Main/Sidebar.svelte";

    import "$styles/variables.scss";
    import "$styles/reset.css";
    import "$styles/app.scss";

    import { page } from "$app/state";
    import Banner from "$components/Banner.svelte";
    import { isMobile } from "$stores/global.js";

    let { data, children } = $props();

    let mounted = $state<boolean>(false);
    let hasChannel = $state<boolean>(false);

    const setMobile = () => isMobile.set(window.innerWidth <= 768);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        hasChannel = params.has("channel") || params.has("id");

        setMobile();
        window.addEventListener("resize", setMobile);

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
            {#if page.status == 200 && !["/auth"].includes(page.route.id ?? "")}
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

        background: #0a0a0a;
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column-reverse;
            overflow: hidden;
        }
    }
</style>
