<script lang="ts">
  import { onMount } from "svelte";

  import { getPaint, getPaintHTML } from "$lib/services/7TV/cosmetics";
  import { replaceWithEmotes } from "$lib/emoteParser";
  import { parseBadges } from "$lib/badgeParser";

  import Badge from "./Badge.svelte";

  import { type Setting, settings } from "$stores/settings";
  import { emotes, badges, globals } from "$stores/global";
  import { cosmetics } from "$stores/cosmetics";
  import { disconnect, messages } from "$lib/chat";
  import { getChannelEmotesViaTwitchID } from "$lib/emotes";
  import { loadChat } from "$lib/loadChat";

  import { services } from "$lib/services";

  export let message: {
    user: string;
    text: string;
    tags: Record<string, any>;
    id: string;
    room_id: number;
  };

  const tags = message.tags;
  const username = tags?.username.toLowerCase().trim() || "";
  const nameColor = message.tags.color || usernameColor(username);

  const UChatMods = ["528761326", "166427338"];
  if (
    UChatMods.includes(message.tags["user-id-raw"]) ||
    message.tags?.mod ||
    message.tags?.["badges-raw"]?.includes("broadcaster/1")
  ) {
    switch (
      message.text.toLowerCase().replace("!uchat ", "").replace("!", "")
    ) {
      case "reloadchat":
        window.location.reload();

        break;
      case "refreshchat":
        loadChat(true);

        break;
      case "reloadws":
        try {
          services["7TV"].ws.close();
          services["BTTV"].ws.close();
        } catch (err) {} // HERE JUST IN CASE THE WEBSOCKET IS NOT OPEN

        break;
      case "reconnectchat":
        disconnect();

        break;
      default:
        break;
    }
  }

  if (message.room_id) {
    getChannelEmotesViaTwitchID(String(message.room_id));
  }

  let FFZBadges = $badges.FFZ;

  let chatMessage: HTMLElement;

  globals.userNameColor[username] = nameColor;

  let chatSettings: Record<string, Setting["value"]> = {};

  $: if (chatSettings?.fadeOut && window.location.search) {
    const delay = Number(chatSettings.fadeOut) * 1000;

    setTimeout(() => {
      if (!chatMessage) return;
      chatMessage.classList.add("fadeOut");

      setTimeout(() => {
        if (!chatMessage) return;
        chatMessage.remove();
        chatMessage = undefined as unknown as HTMLElement;

        messages.update((e) =>
          e.filter((msg) => msg.tags.id != message.tags.id),
        );
      }, 2600);
    }, delay);
  }

  let userPaint: Paint | undefined;
  $: paintHTML = userPaint
    ? getPaintHTML(userPaint)
    : ({ paint: "", shadow: "" } as { paint: string; shadow: string });

  $: paintStyle =
    userPaint && chatSettings["paints"]
      ? (() => {
          let style = `background-color: ${nameColor};`;

          style += paintHTML.paint || "";

          if (chatSettings["paintShadows"]) {
            style += paintHTML.shadow || "";
          } else if (
            !chatSettings["paintShadows"] &&
            chatSettings["fontStroke"]
          ) {
            style += "-webkit-text-stroke: 1px black;";
          }

          return style;
        })()
      : `color: ${nameColor};`;

  userPaint = getPaint(username);

  let parsedBadges = parseBadges(tags);

  $: userBadges =
    typeof chatSettings?.["badges"] == "undefined" || chatSettings?.["badges"]
      ? parsedBadges
      : ([] as parsedBadge[]);
  let emoteText = message.text;

  async function parse() {
    emoteText = await replaceWithEmotes(
      message.text,
      message.tags,
      message.tags["source-room-id"] ?? message.tags["room-id"],
      chatSettings,
    );
  }

  parse();

  if (!window.location.search) {
    emotes.subscribe(() => parse());

    badges.subscribe(async () => {
      parsedBadges = parseBadges(tags);
    });

    settings.subscribe(() => parse());
  } else {
    badges.subscribe(async (e) => {
      FFZBadges = e["FFZ"];
    });
  }

  // THIS CAN BE KEPT ON OVERLAY
  const unsubscribeCosmetics = cosmetics.subscribe(async () => {
    parsedBadges = parseBadges(tags);
    userPaint = getPaint(username);
  });

  const unsubscribeSettings = settings.subscribe((config) => {
    for (const setting of config) {
      chatSettings[setting.param] = setting.value;
    }
  });

  function usernameColor(name: string) {
    const colors = [
      "#0000FF", // Blue
      "#8A2BE2", // Blue Violet
      "#5F9EA0", // Cadet Blue
      "#D2691E", // Chocolate
      "#FF7F50", // Coral
      "#1E90FF", // Dodger Blue
      "#B22222", // Firebrick
      "#DAA520", // Golden Rod
      "#008000", // Green
      "#FF69B4", // Hot Pink
      "#FF4500", // Orange Red
      "#FF0000", // Red
      "#2E8B57", // Sea Green
      "#00FF7F", // Spring Green
      "#9ACD32", // Yellow Green
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  onMount(() => {
    return () => {
      unsubscribeSettings();
      unsubscribeCosmetics();
    };
  });
</script>

{#snippet paint()}
  <strong
    class="username"
    class:paint={chatSettings["paints"] && userPaint}
    style={paintStyle}
  >
    {@html message.user}
  </strong>
{/snippet}

{#snippet Badges()}
  <strong class="badge-wrapper">
    {#each userBadges as badge, i (i)}
      <Badge
        badge={{
          badge_url: badge.badge_url,
          alt: badge.alt,
          background_color: badge.background_color!,
        }}
      />
    {/each}
  </strong>
{/snippet}

<div class="chat-message" bind:this={chatMessage}>
  {#if userBadges.length}{@render Badges()}{/if}
  {@render paint()}{#if !message.tags.action}:{/if}
  <span style:color={message.tags.action ? nameColor : "defaultColor"}
    >{@html emoteText}</span
  >
</div>

<style lang="scss">
  .chat-message {
    padding: 0.1rem 0rem;

    .badge-wrapper {
      display: inline-flex;
      line-height: normal;
      vertical-align: middle;
      gap: 5px;
    }

    &:global(.fadeOut) {
      animation: fadeIt 2.5s forwards;
    }
  }

  @keyframes fadeIt {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
