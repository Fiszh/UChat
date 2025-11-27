<script lang="ts">
  import { onMount } from "svelte";

  import { replaceWithEmotes } from "$lib/emoteParser";
  import { parseBadges } from "$lib/badgeParser";
  import { getPaint, getPaintHTML } from "$lib/services/7TV/cosmetics";

  import Badge from "./Badge.svelte";

  import { type Setting, settings } from "$stores/settings";
  import { emotes, badges } from "$stores/global";
  import { cosmetics } from "$stores/cosmetics";

  export let message: {
    user: string;
    text: string;
    tags: Record<string, any>;
  };

  const tags = message.tags;
  const username = tags?.username.toLowerCase().trim();

  let chatSettings: Record<string, Setting["value"]> = {};

  let userPaint: Paint | undefined;
  $: paintHTML = userPaint
    ? getPaintHTML(userPaint)
    : ({ paint: "", shadow: "" } as { paint: string; shadow: string });

  $: paintStyle = userPaint
    ? `background-color: ${message.tags.color || usernameColor(username)};
      ${typeof chatSettings?.["paints"] == "undefined" || chatSettings?.["paints"] ? 
      paintHTML.paint + `${typeof chatSettings?.["paintShadows"] == "undefined" || chatSettings?.["paintShadows"] ? 
      paintHTML.shadow : ""}` : ""}`
    : `color: ${message.tags.color || usernameColor(username)};`;

  userPaint = getPaint(username);

  let parsedBadges = parseBadges(tags);

  $: userBadges =
    typeof chatSettings?.["badges"] == "undefined" || chatSettings?.["badges"]
      ? parsedBadges
      : ([] as parsedBadge[]);
  let emoteText = message.text;

  (async () => {
    emoteText = await replaceWithEmotes(
      message.text,
      message.tags,
      message.tags["room-id"],
    );
  })();

  if (!window.location.search) {
    emotes.subscribe(async () => {
      emoteText = await replaceWithEmotes(
        message.text,
        message.tags,
        message.tags["room-id"],
      );
    });

    badges.subscribe(async () => {
      parsedBadges = parseBadges(tags);
    });
  }

  // THIS CAN BE KEPT ON OVERLAY
  const unsubscribeCosmetics = cosmetics.subscribe(async () => {
    parsedBadges = parseBadges(tags);
    userPaint = getPaint(username);
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

  const unsubscribeSettings = settings.subscribe((config) => {
    for (const setting of config) {
      chatSettings[setting.param] = setting.value;
    }
  });

  onMount(() => {
    return () => {
      unsubscribeSettings();
      unsubscribeCosmetics();
    };
  });
</script>

{#snippet paint()}
  <strong class="username" class:paint={userPaint} style={paintStyle}>
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

<div class="chat-message">
  {#if userBadges.length}{@render Badges()}{/if}
  {@render paint()}:
  <span>{@html emoteText}</span>
</div>

<style lang="scss">
  .chat-message {
    padding: 0.1rem 0rem;

    .paint {
      -webkit-text-fill-color: transparent;
      background-clip: text !important;
      -webkit-background-clip: text !important;
      background-size: cover !important;
      text-shadow: none !important;
    }

    .badge-wrapper {
      display: inline-flex;
      line-height: normal;
      vertical-align: middle;
      gap: 5px;
    }
  }
</style>
