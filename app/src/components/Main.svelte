<script lang="ts">
  import Sidebar from "./Main/Sidebar.svelte";
  import MainDisplay from "./Main/Chat/Main.svelte";

  import HelpMain from "./Main/Help/Main.svelte";

  import { overlayVersion } from "$stores/settings";

  let hash = window.location.hash;

  const onHashChange = () => (hash = window.location.hash);

  window.addEventListener("hashchange", onHashChange);

  $: console.log("Hash changed to", hash);

  (async () => {
    try {
      const response_version = await fetch("/manifest.json");
      const data_version = await response_version.json();

      overlayVersion.set(data_version.version);
    } catch (err) {
      overlayVersion.set("Unknown version");
      console.error(err);
    }
  })();
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
