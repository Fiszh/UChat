<script lang="ts">
    import { onMount } from "svelte";

    import { getPaint, getPaintHTML } from "$lib/services/7TV/cosmetics";
    import { replaceWithEmotes } from "$lib/emoteParser";
    import { parseBadges } from "$lib/badgeParser";
    import { fixNameColor } from "$lib/overlayIndex";

    import Badge from "./Badge.svelte";

    import { type Setting, settings } from "$stores/settings";
    import { emotes, badges, globals } from "$stores/global";
    import { cosmetics } from "$stores/cosmetics";
    import { messages } from "$lib/chat";
    import { getChannelEmotesViaTwitchID } from "$lib/emotes";

    interface Props {
        user: string;
        text: string;
        tags: Record<string, any>;
        id: string;
        room_id: number;
    }

    let { user, text, tags, id, room_id }: Props = $props();

    const username = $derived(tags?.username.toLowerCase().trim() ?? "");
    const nameColor = $derived(
        tags.color ? fixNameColor(tags.color) : usernameColor(username),
    );

    let chatMessage: HTMLElement;

    let chatSettings: Record<string, Setting["value"]> = {};

    $effect(() => {
        if (chatSettings?.fadeOut && window.location.search) {
            const delay = Number(chatSettings.fadeOut) * 1000;

            setTimeout(() => {
                if (!chatMessage) return;
                chatMessage.classList.add("fadeOut");

                setTimeout(() => {
                    if (!chatMessage) return;
                    chatMessage.remove();
                    chatMessage = undefined as unknown as HTMLElement;

                    messages.update((e) =>
                        e.filter((msg) => msg.tags.id != tags.id),
                    );
                }, 2600);
            }, delay);
        }
    });

    let userPaint = $derived<Paint | undefined>(
        username ? getPaint(username) : undefined,
    );
    let paintHTML = $state<Record<string, string>>({ paint: "", shadow: "" });

    $effect(() => {
        if (userPaint) {
            paintHTML = getPaintHTML(userPaint);
        } else {
            paintHTML = { paint: "", shadow: "" };
        }
    });

    let paintStyle = $derived<string>(
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
            : `color: ${nameColor};`,
    );

    let parsedBadges = $derived(parseBadges(tags));

    let userBadges = $derived(
        typeof chatSettings?.["badges"] == "undefined" ||
            chatSettings?.["badges"]
            ? parsedBadges
            : ([] as parsedBadge[]),
    );

    let emoteText = $state<string>();

    const parse = async () =>
        (emoteText = await replaceWithEmotes(
            text,
            tags,
            tags["source-room-id"] ?? tags["room-id"],
            chatSettings,
        ));

    parse();

    if (!window.location.search) {
        emotes.subscribe(() => parse());

        badges.subscribe(async () => (parsedBadges = parseBadges(tags)));

        settings.subscribe(() => parse());
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
        if (room_id) getChannelEmotesViaTwitchID(String(room_id));

        globals.userNameColor[username] = nameColor;

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
        {@html user}
    </strong>
{/snippet}

{#snippet Badges()}
    <strong class="badge-wrapper">
        {#each userBadges as badge, i (i)}
            <Badge
                badge_url={badge.badge_url}
                alt={badge.alt}
                background_color={badge.background_color}
            />
        {/each}
    </strong>
{/snippet}

<div class="chat-message" bind:this={chatMessage}>
    {#if userBadges.length}{@render Badges()}{/if}
    {@render paint()}{#if !tags.action}:{/if}
    <span style:color={tags.action ? nameColor : "defaultColor"}
        >{@html emoteText || text}</span
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
