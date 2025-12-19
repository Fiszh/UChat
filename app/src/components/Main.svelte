<script lang="ts">
  import { Coffee, Github, Home, Info } from "lucide-svelte";

  import Sidebar from "./Main/Sidebar.svelte";
  import MainDisplay from "./Main/Chat/Main.svelte";

  import HelpMain from "./Main/Help/Main.svelte";
  
  import { icon_size, isMobile } from "$stores/global";

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

  {#if $isMobile}
    <footer>
      <a href="/#">
        <Home size={$icon_size} /> Home
      </a>
      <a href="#help">
        <Info size={$icon_size} /> About
      </a>
      <a
        class="hide-on-small"
        href="https://github.com/Fiszh/UChat"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github size={$icon_size} /> GitHub
      </a>
      <a
        class="hide-on-small"
        href="https://buymeacoffee.com/jzlnkf5qgo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Coffee size={$icon_size} /> Support
      </a>
    </footer>
  {/if}
</main>

<style lang="scss">
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

    footer {
      border-top: 1px #333 solid;
      padding: 0.5rem 2rem;
      box-sizing: border-box;
      width: 100%;
      display: flex;
      justify-content: space-evenly;

      font-size: 0.6rem;

      a {
        all: unset;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
  @media (max-width: 320px) {
    footer .hide-on-small {
      display: none;
    }
  }
</style>
