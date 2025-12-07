<script>
  import { onMount } from "svelte";

  import ChatOverlay from "../components/ChatOverlay.svelte";

  import Main from "../components/Main.svelte";

  import LoadingUI from "../components/Loading.svelte";

  import { loadingInfo } from "$stores/global";
  import { overlayVersion } from "$stores/settings";
  import { getVersion } from "$lib/overlayIndex";

  $: LoadingMsg = $loadingInfo;

  let mounted = false;
  let hasChannel = false;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    hasChannel = params.has("channel") || params.has("id");

    (async () => {
      overlayVersion.set(await getVersion());
    })();
    
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

<style lang="scss">
  :global {
    .paint {
      -webkit-text-fill-color: transparent;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      background-size: cover !important;
      text-shadow: none !important;
    }

    // THIS MAKES SURE BITS DISPLAY DONT LOOK WEIRD
    .bits-wrapper {
      display: inline-flex;
      vertical-align: middle;
    }

    /* 
    START
    WHAT MAKES EMOTES WORK IN ZERO-WIDTH 
    */
    .emote-wrapper {
      display: inline-grid;
      grid-auto-rows: 0px;

      position: relative;

      line-height: normal;
      vertical-align: middle;

      .emote {
        justify-self: center;
      }

      .emote.emoji {
        height: 100vh;
      }
    }
    /* END */

    .twemoji {
      height: 100vh !important;
      display: inline-block;
      vertical-align: middle;
      line-height: normal;
    }

    .note {
      color: rgba(255, 255, 255, 0.575);
      user-select: all;
    }

    a {
      all: unset;
      display: block;
      color: #8b8bff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    a[href="#help-notice"] {
      margin-bottom: 5px;
      text-align: center;
      display: block;
    }

    #rainbow-text {
      font-weight: bold;
      background: linear-gradient(
        90deg,
        red,
        orange,
        yellow,
        green,
        blue,
        indigo,
        violet,
        red
      );
      background-size: 200%;
      animation: rainbow 5s linear infinite;
      display: inline-block;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
    }

    @keyframes rainbow {
      0% {
        background-position: 200% 50%;
      }

      50% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0% 50%;
      }
    }
  }
</style>
