<script lang="ts">
  import { replaceWithEmotes } from "$lib/emoteParser";
  import { parseBadges } from "$lib/badgeParser";
  import { getPaint } from "$lib/services/7TV/cosmetics";

  import Badge from "./badge.svelte";

  export let message: {
    user: string;
    text: string;
    tags: Record<string, any>;
  };

  let userPaint: Paint;
  $: paintStyle = userPaint
    ? `
      background-color: ${message.tags.color || usernameColor(message.user)};
      ${userPaint.backgroundImage ? `background-image: ${userPaint.backgroundImage};` : ""}
      ${userPaint.shadows ? `filter: ${userPaint.shadows};` : ""}
    `
    : `color: ${message.tags.color || usernameColor(message.user)};`;

  userPaint = getPaint(message.user) as Paint;
  console.log(userPaint);

  let userBadges: parsedBadge[] = parseBadges(message.tags);

  let emoteText = message.text;

  (async () => {
    emoteText = await replaceWithEmotes(
      message.text,
      message.tags,
      message.tags["room-id"],
    );
  })();

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
</script>

{#snippet paint()}
  <strong class="username" class:paint={userPaint} style={paintStyle}>
    {@html message.user}
  </strong>
{/snippet}

{#snippet badges()}
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
  {#if userBadges.length}{@render badges()}{/if}
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
