<script lang="ts">
    import ChatDisplay from "$components/ChatDisplay.svelte";
    import { messages } from "$lib/chat";
    import { Download, RefreshCcw } from "@lucide/svelte";
    import Settings from "$components/Main/Chat/Settings.svelte";

    import { toPng } from "html-to-image";

    import { initChat } from "$lib/loadChat";
    import { getUser } from "$lib/services/twitch";
    import { getChannelEmotesViaTwitchID } from "$lib/emotes/main";
    import { pushUserInfoViaGQL } from "$lib/services/7TV/cosmetics";
    import { getBadges } from "$lib/preview";

    import SevenTV_main from "$lib/services/7TV/main";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Banner from "$components/Banner.svelte";
    import { isFirefox, isSafari } from "$lib/browser";
    import { addToast } from "$lib/toast";
    import { previewMessages } from "$stores/previewMessages";
    import { t } from "svelte-i18n";

    let messageDisplay: HTMLElement;

    async function loadChatInfo() {
        await initChat();
        await getBadges();

        const channel_info = await getUser(channel.name);
        const user_info = await getUser(message["tags"]["display-name"]);

        let sevenTV_user_id;
        let mappedBadges = "";

        if (user_info) {
            if (user_info[0]["badges"].length) {
                mappedBadges = user_info[0]["badges"]
                    .flatMap(
                        (badge: Record<string, string>) =>
                            badge["setID"] + "/" + badge["version"],
                    )
                    .join(",");
            }

            message["tags"]["user-id"] = user_info[0]["id"];
            message["tags"]["user-id-raw"] = String(user_info[0]["id"]);
            message["tags"]["color"] = user_info[0]["chatColor"];

            const sevenTV_user = await SevenTV_main.user.byTwitchID(
                user_info[0]["id"],
            );

            if (sevenTV_user) sevenTV_user_id = sevenTV_user["id"];
        }

        if (sevenTV_user_id) await pushUserInfoViaGQL(sevenTV_user_id);

        if (channel_info) channel = { ...channel, id: channel_info[0]["id"] };
        if (user_info)
            message = {
                ...message,
                tags: {
                    ...message.tags,
                    "badges-raw": mappedBadges,
                } as typeof message.tags,
            };

        getChannelEmotesViaTwitchID(channel.id);
    }

    function loadUserInfo() {
        addToast({ msg: $t("toasts.loading_info") });

        loadChatInfo()
            .then(() =>
                addToast({
                    msg: $t("toasts.loaded_info"),
                    type: "success",
                }),
            )
            .catch(() =>
                addToast({
                    msg: $t("toasts.loading_info_fail"),
                    type: "error",
                }),
            );
    }

    function downloadImage() {
        if (messageDisplay) {
            messageDisplay.classList.remove("bg-grid");

            toPng(messageDisplay, {
                pixelRatio: 2,
                backgroundColor: undefined,
            }).then((dataUrl) => {
                messageDisplay.classList.add("bg-grid");

                const link = document.createElement("a");
                link.download = `${channel["name"]}-${message["tags"]["display-name"]}-message.png`;
                link.href = dataUrl;
                link.click();
            });
        }
    }

    let message = $state({
        ...previewMessages[0],
        message: "Hello from UChat!",
    });

    let channel = $state({ name: "Twitch", id: "12826" });

    $effect(() => {
        message["tags"]["room-id"] = channel["id"];
    });

    $effect(() => {
        const tags = {
            ...message.tags,
            username: message["tags"]["display-name"].toLowerCase(),
        };

        messages.set([{ ...message, tags }]);
    });
</script>

<Settings />
<main>
    {#if isFirefox() || isSafari()}
        <Banner
            type="outage"
            message={$t("banners.message_creator_buggy", {
                values: {
                    browser: isFirefox() ? "Firefox" : "Safari",
                },
            })}
        />
    {/if}
    <h1>
        {$t("pages.message_creator.title")}
    </h1>
    <section id="message" class="bg-grid" bind:this={messageDisplay}>
        <ChatDisplay />
    </section>
    <p>
        {$t("channel_input.name", {
            values: {
                platform: "",
            },
        })}: {channel.name}
    </p>

    <section id="inputs">
        <label>
            <p>{$t("labels.username")}:</p>
            <Input
                type="text"
                placeholder="Username"
                bind:value={message["tags"]["display-name"]}
            />
        </label>
        <label>
            <p>{$t("labels.message")}:</p>
            <Input
                type="text"
                placeholder="Message"
                bind:value={message["message"]}
            />
        </label>
        <label>
            <p>{$t("labels.channel")}:</p>
            <Input
                type="text"
                placeholder="Channel"
                bind:value={channel["name"]}
            />
        </label>
    </section>

    {#snippet LoadIcon()}
        <RefreshCcw />
    {/snippet}
    {#snippet DownloadIcon()}
        <Download />
    {/snippet}

    <Button secondary icon={LoadIcon} onclick={loadUserInfo}>
        {$t("pages.message_creator.fetch_channel")}
    </Button>
    <Button primary icon={DownloadIcon} onclick={downloadImage}>
        {$t("pages.message_creator.download")}
    </Button>
</main>

<style lang="scss">
    @use "sass:color";

    p {
        user-select: none;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }

    #message {
        padding: 0.5rem;
        box-sizing: border-box;
        user-select: none;

        :global(.chat) {
            position: unset !important;
            bottom: unset !important;
        }
    }

    #inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        font-size: 1.3rem;
    }
</style>
