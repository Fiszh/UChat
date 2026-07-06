<script lang="ts">
    import { onMount } from "svelte";

    import { getPaint, getPaintHTML } from "$lib/services/7TV/cosmetics";
    import { replaceWithEmotes } from "$lib/emoteParser";
    import { parseBadges } from "$lib/badges/parser";
    import { fixNameColor } from "$lib/overlayIndex";

    import Badge from "../../Badge.svelte";

    import { type Setting, settings } from "$stores/settings";
    import { emotes, badges, globals } from "$stores/global";
    import { cosmetics } from "$stores/cosmetics";
    import { messages } from "$lib/chat";
    import Kick from "$components/logos/kick.svelte";

    type Props = {
        user: string;
        text: string;
        tags: Record<string, any>;
        id: string;
        room_id: number;
    };

    let { user, text, tags, id, room_id }: Props = $props();

    let username = $state<Lowercase<string>>("");
    let nameColor = $state<string>();

    let userPaint = $state<Paint>();

    let parsedBadges = $state<parsedBadge[]>();

    let chatMessage: HTMLElement;

    let chatSettings: Record<string, Setting["value"]> = $state({});

    onMount(() => {
        if (Number(chatSettings?.fadeOut) && window.location.search) {
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

        username = tags?.username.toLowerCase().trim() || "";
        nameColor = tags["identity"]["color"]
            ? fixNameColor(tags["identity"]["color"])
            : usernameColor(username);
        parsedBadges = parseBadges(
            {},
            { username, user_id: tags["identity"]["id"] },
        );
        userPaint = getPaint(username);

        globals.userNameColor[username] = nameColor;

        if (!window.location.search)
            badges.subscribe(
                async () =>
                    (parsedBadges = parseBadges(
                        {},
                        { username, user_id: tags["identity"]["id"] },
                    )),
            );
    });

    const paintHTML = $derived(
        userPaint
            ? getPaintHTML(userPaint)
            : ({ paint: "", shadow: "" } as { paint: string; shadow: string }),
    );

    const paintStyle = $derived(
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

    const userBadges = $derived(
        typeof chatSettings?.["badges"] == "undefined" ||
            chatSettings?.["badges"]
            ? parsedBadges
            : ([] as parsedBadge[]),
    );

    // THIS CAN BE KEPT ON OVERLAY
    const unsubscribeCosmetics = cosmetics.subscribe(async () => {
        parsedBadges = parseBadges(
            {},
            { username, user_id: tags["identity"]["id"] },
        );
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

    onMount(() => () => {
        unsubscribeSettings();
        unsubscribeCosmetics();
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
        {#if globals.channelTwitchName}
            <Kick brandColor={true} />
        {/if}
        {#if userBadges && userBadges.length}
            {#each userBadges as badge, i (i)}
                <Badge
                    badge_url={badge.badge_url}
                    alt={badge.alt}
                    background_color={badge.background_color}
                />
            {/each}
        {/if}
    </strong>
{/snippet}

<div class="chat-message" bind:this={chatMessage}>
    {#if (userBadges && userBadges.length) || globals.channelKickName}{@render Badges()}{/if}
    {@render paint()}:
    <span>{@html text}</span>
</div>

<style lang="scss">
    .chat-message {
        padding: 0.1rem 0rem;

        .badge-wrapper {
            display: inline-flex;
            line-height: normal;
            vertical-align: middle;
            gap: 0.25rem;
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
