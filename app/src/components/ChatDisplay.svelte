<script lang="ts">
  import { onMount } from "svelte";

  import ChatMessage from "./ChatMessage.svelte";

  import { messages } from "$stores/chat";

  let chatMessages: Record<string, any>[] = [];
  let chat: HTMLElement;

  const unsubscribeMessages = messages.subscribe(
    (msgs) => (chatMessages = msgs),
  );

  onMount(() => {
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
    {#each chatMessages as msg, i (msg.tags["id"] ?? msg.tags["user-id"] ?? i)}
      {#if msg.command == "PRIVMSG"}
        <ChatMessage
          message={{
            user: msg.tags?.username || "Unknown",
            text: `${msg.message}`,
            tags: msg.tags,
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
