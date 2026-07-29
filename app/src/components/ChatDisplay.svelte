<script lang="ts">
    import { onMount } from "svelte";

    import TwitchChatMessage from "$components/chat/twitch/message.svelte";
    import KickChatMessage from "$components/chat/kick/message.svelte";

    import { messages } from "$lib/chat";
    import { setEmoteSize, settings, type Setting } from "$stores/settings";
    import { badges, globals } from "$stores/global";
    import { generateUUID } from "$lib/overlayIndex";

    type Props = {
        customStyle?: string;
        scrollSmoothness?: number;
    };

    const {
        customStyle,
        scrollSmoothness = 0.15,
        ...restProps
    }: Props = $props();

    let chatMessages: Record<string, any>[] = $state([]);
    let chat: HTMLElement | undefined = $state();

    let instantScroll = $state(false);

    let styles: Record<string, string | number> = $state({});
    const chatStyle = $derived(
        Object.entries(styles)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; "),
    );

    const unsubscribeMessages = messages.subscribe(
        (msgs) => (chatMessages = msgs),
    );

    type ChatSettings = Record<
        string,
        Record<string, Setting["value"] | string[]>
    >;

    let chatSettings: ChatSettings = $state({});

    const unsubscribeSettings = settings.subscribe((config) => {
        chatSettings = config.reduce<ChatSettings>((acc, setting) => {
            if (setting.type == "text" && setting.list) {
                acc[setting.param] = {
                    value: setting.value.split(" ").filter(Boolean),
                    default: setting.default!,
                };
            } else {
                acc[setting.param] = {
                    value: setting.value,
                    default: setting.default!,
                };
            }

            return acc;
        }, {});

        if (!window.location.search) {
            const localSettings = Object.entries(chatSettings).reduce<
                Record<string, ChatSettings[string][string]>
            >((acc, [key, value]) => {
                acc[key] = value.value;

                return acc;
            }, {});

            localStorage.setItem(
                "local-settings",
                JSON.stringify(localSettings),
            );
        }

        for (const setting of config) {
            if (
                !window.location.search && // CHECKS IF ITS PREVIEW
                typeof setting.previewReact != "undefined" &&
                !setting.previewReact // CHECKS IF SETTING IS REACTIVE IN PREVIEW
            )
                continue;

            switch (setting.param) {
                case "msgBold":
                    styles["--chat-bold"] = setting.value ? "900" : "normal";

                    break;
                case "msgCaps":
                    styles["--chat-case"] = setting.value
                        ? "uppercase"
                        : "unset";

                    break;
                case "font":
                    const font = setting.value as string;

                    styles["--chat-font"] = font
                        ? `${font.includes(" ") ? `"${font}"` : font}, Geist`
                        : "Geist";

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

                    styles["--chat-font-stroke"] = setting.value
                        ? shadowStyle
                        : "unset";

                    break;
                case "fontShadow":
                    styles["--chat-shadow"] =
                        (typeof setting.value == "string"
                            ? Number(setting.value)
                            : 10) / 10;

                    break;
                case "emoteSize":
                    let emoteSize = setting.value;
                    const fontSize = chatSettings["fontSize"];

                    if (
                        emoteSize == setting.default &&
                        fontSize.value != fontSize.default &&
                        typeof fontSize.value == "number"
                    )
                        emoteSize = String(Number(fontSize.value) + 5);

                    styles["--chat-emote-size"] = emoteSize
                        ? `${emoteSize}px`
                        : "25px";

                    setEmoteSize.set(emoteSize as string);

                    break;
                case "fontColor":
                    styles["--chat-font-color"] =
                        setting.value && typeof setting?.value == "string"
                            ? `${!setting.value.startsWith("#") ? "#" : ""}${setting.value}`
                            : "white";

                    break;
                case "smoothScroll":
                    if (typeof setting.value == "boolean")
                        instantScroll = !setting.value;

                    break;
                default:
                    if (typeof setting.value == "string")
                        setting.value = setting.value.toLowerCase();

                    break;
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
            Array.isArray(chatSettings["userBL"].value)
                ? !chatSettings["userBL"].value.includes(
                      username?.toLowerCase(),
                  )
                : true,
            Array.isArray(chatSettings["prefixBL"].value)
                ? !chatSettings["prefixBL"].value.some((prefix: string) =>
                      message?.toLowerCase().startsWith(prefix.toLowerCase()),
                  )
                : true,
            !chatSettings["bots"].value ? !user_badges?.["bot-badge"] : true,
            !chatSettings["bots"].value
                ? !globals.custom_bots.includes(username)
                : true,
            !chatSettings["bots"].value
                ? !FFZBadges.find((badge: Record<string, any>) => badge.id == 2)
                : true,
            !chatSettings["bots"].value
                ? $badges["FFZ"]["user"]["user"][tags["user-id"] ?? ""] != 2
                : true,
            !chatSettings["redeem"].value ? !tags?.["custom-reward-id"] : true,
        ];

        return passed.every(Boolean);
    }

    function formatUsername(
        username: string,
        displayName: string,
        platform: Platforms = "TWITCH",
    ): string {
        const trimmedDisplayName = displayName.trim().toLowerCase();

        if (platform == "TWITCH" && username != trimmedDisplayName) {
            return `${username} (${displayName})`;
        }

        if (
            platform == "KICK" &&
            username.replace(/-/g, "_") != trimmedDisplayName
        ) {
            return `${username} (${displayName})`;
        }

        return displayName;
    }

    let filteredMessages = $derived(
        chatMessages
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
                const username = (
                    msg?.tags?.username ??
                    msg?.sender?.slug ??
                    ""
                )
                    .trim()
                    .toLowerCase();

                const displayName = String(
                    msg?.tags?.["display-name"] ?? msg?.sender?.username ?? "",
                );

                return {
                    id: msg?.tags?.id ?? msg?.id ?? generateUUID(), // THIS MAKES SURE MESSAGES WILL NOT MERGE
                    room_id:
                        msg?.tags?.["source-room-id"] ??
                        msg?.["chatroom_id"] ??
                        globals.channelTwitchID,
                    ...msg,
                    formattedUser: formatUsername(
                        username,
                        displayName,
                        msg["service"],
                    ),
                };
            }) as any,
    );

    onMount(() => {
        let currentScroll = chat?.scrollTop ?? 0;
        let targetScroll = 0;
        let animationFrameId = 0;

        function updateScroll() {
            if (!chat) return;

            currentScroll += (targetScroll - currentScroll) * scrollSmoothness;
            chat.scrollTop = currentScroll;

            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                animationFrameId = requestAnimationFrame(updateScroll);
            } else {
                currentScroll = targetScroll;
                animationFrameId = 0; // loop stopped, next mutation can restart it
            }
        }

        const observer = new MutationObserver(() => {
            if (!chat) return;

            targetScroll = chat.scrollHeight - chat.clientHeight;

            if (instantScroll) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
                currentScroll = targetScroll;
                chat.scrollTop = targetScroll;
                return;
            }

            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(updateScroll);
            }
        });

        if (chat) observer.observe(chat, { childList: true });

        return () => {
            unsubscribeMessages();
            unsubscribeSettings();
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    });
</script>

<div
    class="chat"
    bind:this={chat}
    style="{chatStyle}; {customStyle}"
    {...restProps}
>
    {#each filteredMessages as msg (msg.id)}
        {#if msg.service == "KICK"}
            <KickChatMessage
                user={msg.formattedUser}
                text={msg.content}
                tags={msg.sender}
                message_id={msg.id}
                room_id={globals.userKickID ?? msg.room_id}
                /*
                random id
                user id
                and room id
                ngl, we need more ids to confuse the devs instead of a unified one like twitch
                */
                platform={"KICK"}
            />
        {:else}
            <TwitchChatMessage
                user={msg.formattedUser}
                text={msg.message}
                tags={msg.tags}
                message_id={msg.id}
                room_id={msg.room_id}
                platform={"TWITCH"}
            />
        {/if}
    {/each}
</div>

<style lang="scss">
    :global(.chat) {
        --chat-bold: 900;
        --chat-case: unset;
        --chat-font: "Inter";
        --chat-font-size: 20px;
        --chat-font-stroke: unset;
        --chat-shadow: 10;
        --chat-emote-size: 20px;
        --chat-font-color: #ffffff;
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

        padding: 0.25rem 0.5rem;
        box-sizing: border-box;

        /* SETTING */
        font-weight: var(--chat-bold);
        text-transform: var(--chat-case);
        font-family: var(--chat-font);
        font-size: var(--chat-font-size);
        text-shadow: var(--chat-font-stroke);
        color: var(--chat-font-color);

        & > :global(*) {
            filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, var(--chat-shadow)));
            // filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.95));
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
