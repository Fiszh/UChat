<script lang="ts">
    import { Coffee, Home, Info } from "@lucide/svelte";

    import MainDisplay from "./Main/Chat/Main.svelte";

    import HelpMain from "./Main/Help/Main.svelte";

    import MessageCreatorMain from "./Main/MessageCreator/Main.svelte";

    import { icon_size, isMobile } from "$stores/global";
    import Github from "./logos/github.svelte";

    let hash = window.location.hash;

    const onHashChange = () => (hash = window.location.hash);

    window.addEventListener("hashchange", onHashChange);

    $: console.log("Hash changed to", hash);
</script>

{#if hash.includes("help")}
    <HelpMain />
{:else if hash.includes("message-creator")}
    <MessageCreatorMain />
{:else}
    <MainDisplay />
{/if}
