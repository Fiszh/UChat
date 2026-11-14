<script lang="ts">
    import { onMount } from "svelte";

    import Sidebar from "#components/Main/Sidebar.svelte";

    import "#styles/variables.scss";
    import "#styles/reset.css";
    import "#styles/app.scss";
    import "#styles/ffz.css";

    import { page } from "$app/state";
    import Banner from "#components/Banner.svelte";
    import { isMobile } from "#stores/global.js";

    import { RenderScan } from "svelte-render-scan";
    import ToastWrapper from "#components/toast/Wrapper.svelte";
    import { dev } from "$app/env";
    import { isPogly } from "#lib/pogly.js";
    import UChat from "#components/logos/uchat.svelte";
    import MobileTopbar from "#components/mobileTopbar.svelte";
    import DebugDialog from "#components/dialogs/debug.svelte";

    let { data, children } = $props();

    let mounted = $state<boolean>(false);

    const setMobile = () => isMobile.set(window.innerWidth <= 768);

    let accentColor = $state("var(--default-accent)");

    onMount(() => {
        setMobile();
        window.addEventListener("resize", setMobile);

        mounted = true;

        if (dev) accentColor = "#ffb020";
    });

    interface AllowedSite {
        RegEx: RegExp;
        type: "full" | "limited";
    }

    const allowedSites: AllowedSite[] = [
        {
            RegEx: /^http:\/\/(?:[a-zA-Z0-9-]+\.)?localhost(?::\d+)?\//,
            type: "full",
        },
        {
            RegEx: /^https:\/\/[a-zA-Z0-9-]+\.unii\.dev\//,
            type: "full",
        },
        {
            RegEx: /^https:\/\/[a-zA-Z0-9-]+\.pogly\.gg\//,
            type: "full",
        },
    ];

    const isSiteAllowed = (url: string | null) => {
        if (!url) return "limited";

        const allowedSite = allowedSites.find((s) => s["RegEx"].test(url));

        return allowedSite ? allowedSite["type"] : "limited";
    };

    $effect(() => {
        document.body.style.setProperty("--accent", accentColor);
        return () => document.body.style.removeProperty("--accent");
    });
</script>

<svelte:head>
    <link
        rel="icon"
        href={dev ? "/images/logo_dev.svg" : "/images/logo.svg"}
        type="image/svg+xml"
    />
</svelte:head>

{#if __DEBUG__}
    <RenderScan />

    <DebugDialog />
{/if}

{#if data.isEmbedded && isSiteAllowed(data.embedderUrl) == "limited"}
    <div id="embed-of">
        <p>EMBED OF UCHAT:</p>
        <a
            href={window.location.origin}
            target="_blank"
            rel="noopener noreferrer"
        >
            {window.location.host}
        </a>
    </div>
{/if}

{#if mounted}
    <div style="display:contents;">
        {#if !data.hasChannel}
            {#if isPogly()}
                <main>
                    <section id="pogly">
                        <UChat pride size="5rem" />
                        <h1>UChat</h1>
                        <small>Pogly Widget</small>
                        <p>Set your channel in the widget settings</p>
                    </section>
                </main>
            {:else}
                <ToastWrapper />
                {#if data.statusMessage == null}
                    <Banner type="fail" />
                {:else if data.statusMessage && (data.statusMessage.type || data.statusMessage.message)}
                    <Banner {...data.statusMessage} />
                {/if}
                <main>
                    {#if page.status == 200 && !["/auth", "/test"].includes(page.route.id ?? "")}
                        <Sidebar />
                    {/if}
                    {@render children()}
                    {#if $isMobile}
                        <MobileTopbar />
                        <!-- MOBILE IS REVERSED COLUMN -->
                    {/if}
                </main>
            {/if}
        {:else}
            {@render children()}
        {/if}
    </div>
{:else}
    <main>Loading...</main>
{/if}

<style>
    main {
        display: flex;
        width: 100%;
        height: 100%;

        overflow: hidden;

        background: #0a0a0a;
    }

    #embed-of {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #0e0e0e;
        padding: 0.5rem 1rem;
        position: fixed;
        z-index: 9999;
        font-weight: bold;
        border-radius: 0.75rem;
        right: 0.5rem;
        bottom: 0.5rem;
        border: 1px var(--accent) solid;
        font-size: 0.75rem;
    }

    #pogly {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;

        h1 {
            line-height: 1;
            color: var(--accent);
        }
    }

    @media (max-width: 768px) {
        main {
            flex-direction: column-reverse;
            overflow: hidden;
        }
    }
</style>
