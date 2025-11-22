<script lang="ts">
  import { onMount } from "svelte";
  
  import ChatMessage from "./ChatMessage.svelte";

  import { globals } from "$stores/global";
  import { messages, connectionStatus, connect } from "$stores/chat";

  import { getMainUser, connectToWS } from "$lib/overlayIndex";
  import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";

  let chatMessages: Record<string, any>[] = [];
  let status = "";
  let chat: HTMLElement;

  const unsubscribeMessages = messages.subscribe(
    (msgs) => (chatMessages = msgs),
  );
  connectionStatus.subscribe((s) => {
    status = s;
  });

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const channelName = params.get("channel");
    const channelID = params.get("id");

    getGlobalEmotes();

    if (channelName) {
      connect(channelName);
    }

    // GET USER INFO AND IF USED CHANNEL ID CONNECT TO IRC
    (async () => {
      const successGettingUser = await getMainUser(
        channelID ? Number(channelID) : channelName!,
      );

      if (successGettingUser && globals.channelTwitchName && globals.channelTwitchID) {
        if (!channelName) {
          connect(globals.channelTwitchName);
        }

        await getChannelEmotesViaTwitchID(globals.channelTwitchID);

        connectToWS();
      }

      console.log(globals);
    })();

    let scrollTimeout: number;
    const observer = new MutationObserver(() => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
      }, 7); // delay so rapid updates don’t spam scroll
    });

    observer.observe(chat, { childList: true, subtree: true });

    return () => {
      unsubscribeMessages();
      observer.disconnect();
    };
  });
</script>

<div class="chat" bind:this={chat}>
  {#if chatMessages.length > 0}
    {#each chatMessages as msg, i (i)}
      {#if msg.command == "PRIVMSG"}
        <ChatMessage
          message={{
            user: msg.tags?.username || "Unknown",
            text: `${msg.message}`,
            tags: msg.tags
          }}
        />
      {/if}
    {/each}
  {/if}
</div>

<style lang="scss">
  .chat {
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    position: absolute;
    bottom: 0;
  }
</style>
