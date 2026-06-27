<script lang="ts">
    import MainDisplay from "./Main/Chat/Main.svelte";

    import HelpMain from "./Main/Help/Main.svelte";

    import MessageCreatorMain from "./Main/MessageCreator/Main.svelte";

    let hash = $state(window.location.hash);

    const onHashChange = () => (hash = window.location.hash);

    window.addEventListener("hashchange", onHashChange);

    $effect(() => console.log("Hash changed to", hash));
</script>

{#if hash.includes("help")}
    <HelpMain />
{:else if hash.includes("message-creator")}
    <MessageCreatorMain />
{:else}
    <MainDisplay />
{/if}
