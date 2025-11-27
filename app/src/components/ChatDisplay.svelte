<script lang="ts">
  import { onMount } from "svelte";

  import ChatMessage from "./ChatMessage.svelte";

  import { messages } from "$stores/chat";
  import { settings } from "$stores/settings";

  let chatMessages: Record<string, any>[] = [];
  let chat: HTMLElement;

  let styles: Record<string, string> = {};
  $: chatStyle = Object.entries(styles)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  const unsubscribeMessages = messages.subscribe(
    (msgs) => (chatMessages = msgs),
  );

  let chatSettings: Record<string, any> = {};

  const unsubscribeSettings = settings.subscribe((config) => {
    for (const setting of config) {
      switch (setting.param) {
        case "msgBold":
          styles["--chat-bold"] = setting.value ? "bold" : "unset";

          break;
        case "msgCaps":
          styles["--chat-case"] = setting.value ? "uppercase" : "unset";

          break;
        case "font":
          styles["--chat-font"] = setting.value
            ? `${setting.value}, Inter`
            : "Inter";

          break;
        case "fontSize":
          styles["--chat-font-size"] = setting.value
            ? `${setting.value}px`
            : "20px";

          break;
        case "fontStroke":
          const shadowStyle = `1px 1px 0 black,
                               -1px 1px 0 black,
                               1px -1px 0 black,
                               -1px -1px 0 black`;

          styles["--chat-font-stroke"] = setting.value ? shadowStyle : "unset";

          break;
        case "fontShadow":
          styles["--chat-shadow"] = setting.value
            ? `drop-shadow(0 0 5px rgba(0, 0, 0,  ${Math.max(0, Math.min(1, (Number(setting.value) || 4) / 10))}));`
            : "unset";

          break;
        case "emoteSize":
          styles["--chat-emote-size"] = setting.value
            ? `${setting.value}px`
            : "25px";

          break;
        default:
          if (typeof setting.value == "string") {
            setting.value = setting.value.toLowerCase();
          }

          break;
      }

      chatSettings[setting.param] = setting.value;
    }
  });

  function validateMessage(username: string, message: string): boolean {
    const passed = [
      !chatSettings["userBL"].includes(username?.toLowerCase()),
      !chatSettings["prefixBL"].includes(
        message?.charAt(0)?.toLowerCase() || "",
      ),
    ];

    return passed.every(Boolean);
  }
  
  $: filteredMessages = chatMessages
    .filter(
      (msg) =>
        (msg.command === "PRIVMSG" || msg?.tags?.["room-id"] === "0") &&
        chatSettings &&
        validateMessage(msg.tags?.username, msg.message),
    )
    .map((msg) => {
      const username = (msg.tags?.username || "").trim().toLowerCase();
      const displayName = (msg.tags?.["display-name"] || "")
        .trim()
        .toLowerCase();

      return {
        ...msg,
        formattedUser:
          username === displayName
            ? msg.tags?.["display-name"] || "Unknown"
            : `${msg.tags?.username || "Unknown"} (${msg.tags?.["display-name"] || "Unknown"})`,
      };
    }) as any;

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
      unsubscribeSettings();
      observer.disconnect();
    };
  });
</script>

<div class="chat" bind:this={chat} style={chatStyle}>
  {#each filteredMessages as msg, i (msg?.tags?.["id"] ?? i)}
    <ChatMessage
      message={{
        user: msg.formattedUser,
        text: msg.message,
        tags: msg.tags,
      }}
    />
  {/each}
</div>

<style lang="scss">
  :global(.chat) {
    --chat-bold: bold;
    --chat-case: unset;
    --chat-font: "Inter";
    --chat-font-size: 20px;
    --chat-font-stroke: unset;
    --chat-shadow: unset;
    --chat-emote-size: 20px;
  }

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

    /* SETTING */

    font-weight: var(--chat-bold);
    text-transform: var(--chat-case);
    font-family: var(--chat-font);
    font-size: var(--chat-font-size);
    text-shadow: var(--chat-font-stroke);

    & > :global(*) {
      filter: var(--chat-shadow);
    }

    /* EMTOTE SIZE SETTINGS */
    :global(.emote-wrapper) {
      min-height: var(--chat-emote-size);
    }

    :global(.emote) {
      min-height: 5px;
      max-height: var(--chat-emote-size);
    }
  }
</style>
