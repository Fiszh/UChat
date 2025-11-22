<script>
  import ChatOverlay from "../components/ChatOverlay.svelte";
  import Main from "../components/Main.svelte";
  import { onMount } from "svelte";

  let mounted = false;
  let hasChannel = false;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    hasChannel = params.has("channel") || params.has("id");
    mounted = true;
  });
</script>

{#if mounted}
  {#if hasChannel}
    <ChatOverlay />
  {:else}
    <Main />
  {/if}
{/if}
