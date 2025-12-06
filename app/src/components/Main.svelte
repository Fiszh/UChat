<script lang="ts">
  import Sidebar from "./Main/Sidebar.svelte";
  import MainDisplay from "./Main/Chat/Main.svelte";

  import HelpMain from "./Main/Help/Main.svelte";

  let hash = window.location.hash;

  const onHashChange = () => (hash = window.location.hash);

  window.addEventListener("hashchange", onHashChange);

  $: console.log("Hash changed to", hash);
</script>

<main>
  <Sidebar />
  {#if hash.includes("help")}
    <HelpMain />
  {:else}
    <MainDisplay />
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    width: 100%;
    height: 100%;

    background: linear-gradient(#080808, #000000);
  }
</style>
