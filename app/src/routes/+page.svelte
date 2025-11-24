<script>
  import { onMount } from "svelte";

  import ChatOverlay from "../components/ChatOverlay.svelte";

  import Main from "../components/Main.svelte";

  import LoadingUI from "../components/Loading.svelte";
  import { loadingInfo } from "$stores/global";

  $: LoadingMsg = $loadingInfo;

  let mounted = false;
  let hasChannel = false;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    hasChannel = params.has("channel") || params.has("id");
    mounted = true;
  });
</script>

{#if mounted}
  <LoadingUI
    loading={{
      text: LoadingMsg.text,
      type: LoadingMsg.type,
    }}
  />

  {#if hasChannel}
    <ChatOverlay />
  {:else}
    <Main />
  {/if}
{/if}
