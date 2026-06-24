<script lang="ts">
    import ChatDisplay from "$components/ChatDisplay.svelte";
    import { messages } from "$lib/chat";
    import { Download, RefreshCcw } from "@lucide/svelte";
    import Settings from "$components/Main/Chat/Settings.svelte";

    import { toPng } from "html-to-image";

    import { initChat } from "$lib/loadChat";
    import { getUser } from "$lib/services/twitch";
    import { getChannelEmotesViaTwitchID } from "$lib/emotes";
    import { pushUserInfoViaGQL } from "$lib/services/7TV/cosmetics";
    import { getBadges } from "$lib/preview";

    import SevenTV_main from "$lib/services/7TV/main";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";

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
            message["tags"]["color"] = user_info[0]["chatColor"];

            const sevenTV_user = await SevenTV_main.getUserViaTwitchID(
                user_info[0]["id"],
            );

            if (sevenTV_user) sevenTV_user_id = sevenTV_user["id"];
        }

        if (sevenTV_user_id) await pushUserInfoViaGQL(sevenTV_user_id);

        if (channel_info) channel = { ...channel, id: channel_info[0]["id"] };
        if (user_info)
            message = {
                ...message,
                tags: { ...message.tags, "badges-raw": mappedBadges },
            };

        getChannelEmotesViaTwitchID(channel.id);
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
        tags: {
            username: "uniidev",
            "display-name": "uniiDev",
            "user-id": "528761326",
            "badges-raw": "broadcaster/1,twitch-recap-2024/1",
            color: "#ffb3ff",
            "room-id": "0",
        },
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

<Settings dispayChannelInput={false} />
<main>
    <h1>UChat Message Creator</h1>
    <section id="message" class="bg-grid" bind:this={messageDisplay}>
        <ChatDisplay />
    </section>
    <p>Channel: {channel.name}</p>

    <section id="inputs">
        <label>
            <p>Username:</p>
            <Input
                type="text"
                placeholder="Username"
                bind:value={message["tags"]["display-name"]}
            />
        </label>
        <label>
            <p>Message:</p>
            <Input
                type="text"
                placeholder="Message"
                bind:value={message["message"]}
            />
        </label>
        <label>
            <p>Channel:</p>
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

    <Button secondary icon={LoadIcon} onclick={loadChatInfo}>
        Fetch Channel & User
    </Button>
    <Button primary icon={DownloadIcon} onclick={downloadImage}
        >Download image</Button
    >
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
