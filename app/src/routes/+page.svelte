<script>
    import { onMount } from "svelte";

    import ChatOverlay from "../components/ChatOverlay.svelte";

    import LoadingUI from "../components/Loading.svelte";

    import { loadingInfo } from "#stores/global.js";
    import Main from "#components/Main/Chat/Main.svelte";
    import { get } from "svelte/store";

    let { data } = $props();

    let LoadingMsg = $state(get(loadingInfo));

    loadingInfo.subscribe((value) => (LoadingMsg = value));

    let mounted = $state(false);

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

        if (isFirefox) {
            document.documentElement.style.setProperty(
                "--scrollbar-width",
                "auto",
            );
            document.documentElement.style.setProperty(
                "--scrollbar-color",
                "rgb(255,255,255) rgb(10,10,10)",
            );
        }

        mounted = true;

        const hasError = params.get("error");

        if (hasError && hasError == "redirect_mismatch")
            alert("Are you on the right site? Please log in at chat.unii.dev.");
    });
</script>

{#if mounted}
    {#if data.hasChannel}
        <LoadingUI text={LoadingMsg.text} type={LoadingMsg.type} />

        <ChatOverlay />
    {:else}
        <Main />
    {/if}
{/if}
