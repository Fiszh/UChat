<script lang="ts">
  import { onMount } from "svelte";

  import ChatMessage from "./ChatMessage.svelte";

  import { messages } from "$lib/chat";
  import { settings } from "$stores/settings";
  import { badges, globals } from "$stores/global";

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
            ? `"${setting.value}", Inter`
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

      if (setting.list && typeof setting.value == "string") {
        chatSettings[setting.param] = setting.value.split(" ");
      } else {
        chatSettings[setting.param] = setting.value;
      }

      if (!window.location.search) {
        localStorage.setItem("local-settings", JSON.stringify(chatSettings));
      }
    }
  });

  function validateMessage(
    username: string,
    message: string,
    user_badges: Record<string, string>,
    tags: Record<string, string>,
  ): boolean {
    const FFZBadges = $badges["FFZ"]["global"].filter(
      (badge: Record<string, any>) => badge.owners.includes(username),
    ) as Record<string, any>;

    const passed = [
      !chatSettings["userBL"].includes(username?.toLowerCase()),
      !chatSettings["prefixBL"].includes(
        message?.charAt(0)?.toLowerCase() || undefined,
      ),
      !chatSettings["bots"] ? !user_badges?.["bot-badge"] : true,
      !chatSettings["bots"] ? !globals.custom_bots.includes(username) : true,
      !chatSettings["bots"]
        ? !FFZBadges.find((badge: Record<string, any>) => badge.id == 2)
        : true,
      !chatSettings["bots"]
        ? $badges["FFZ"]["user"]["user"][tags["user-id"] ?? ""] != 2
        : true,
      !chatSettings["redeem"] ? !tags?.["custom-reward-id"] : true,
    ];

    return passed.every(Boolean);
  }

  $: filteredMessages = chatMessages
    .filter(
      (msg) =>
        chatSettings &&
        validateMessage(
          msg.tags?.username,
          msg.message,
          msg.tags?.badges,
          msg.tags,
        ),
    )
    .map((msg) => {
      const username = (msg.tags?.username || "").trim().toLowerCase();
      const displayName = String(msg.tags?.["display-name"] ?? "")
        .trim()
        .toLowerCase();

      return {
        id: msg.tags.id ?? crypto.randomUUID(), // THIS MAKES SURE MESSAGES WILL NOT MERGE
        room_id: msg.tags["source-room-id"] ?? globals.channelTwitchID,
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
        if (chat) {
          chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
        }
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
  {#each filteredMessages as msg (msg.id)}
    <ChatMessage
      message={{
        user: msg.formattedUser,
        text: msg.message,
        tags: msg.tags,
        id: msg.id,
        room_id: msg.room_id,
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
