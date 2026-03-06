<script lang="ts">
    import ChatDisplay from "$components/ChatDisplay.svelte";
    import { messages } from "$lib/chat";
    import { Download, RefreshCcw } from "lucide-svelte";
    import Settings from "$components/Main/Chat/Settings.svelte";

    import html2canvas from "html2canvas";
    import { initChat } from "$lib/loadChat";
    import { getUser } from "$lib/services/twitch";
    import { getChannelEmotesViaTwitchID } from "$lib/emotes";
    import { pushUserInfoViaGQL } from "$lib/services/7TV/cosmetics";
    import { getBadges } from "$lib/preview";

    import SevenTV_main from "$lib/services/7TV/main";

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
            html2canvas(messageDisplay, {
                scale: 2,
                windowWidth: 1920,
                windowHeight: 1080,
                useCORS: true,
                allowTaint: false,
                backgroundColor: null,
                onclone: (doc) => {
                    doc.querySelector(".bg-grid")?.classList.remove("bg-grid");
                },
            }).then((canvas) => {
                const link = document.createElement("a");
                link.download = `${channel["name"]}-${message["tags"]["display-name"]}-message.png`;
                link.href = canvas.toDataURL("image/png");
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
    <topbar class="warning">PAINTS CURRENTLY DO NOT WORK</topbar>
    <h2>UChat Message Creator</h2>
    <section id="message" class="bg-grid" bind:this={messageDisplay}>
        <ChatDisplay />
    </section>
    <p>Channel: {channel.name}</p>

    <section id="inputs">
        <label>
            <p>Username:</p>
            <input
                type="text"
                placeholder="Username"
                bind:value={message["tags"]["display-name"]}
            /></label
        >
        <label>
            <p>Message:</p>
            <input
                type="text"
                placeholder="Message"
                bind:value={message["message"]}
            /></label
        >
        <label>
            <p>Channel:</p>
            <input
                type="text"
                placeholder="Channel"
                bind:value={channel["name"]}
            /></label
        >
    </section>

    <button onclick={() => loadChatInfo()}
        ><RefreshCcw /> Fetch Channel & User</button
    >
    <button onclick={() => downloadImage()}><Download /> Download image</button>
</main>

<style lang="scss">
    @use "sass:color";

    .warning {
        width: 100%;
        text-align: center;
        background-color: red;
        padding-block: 0.5rem;
        box-sizing: border-box;
    }

    h2 {
        font-size: 2rem;
    }

    p {
        margin: 0;
        user-select: none;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 1rem;
        font-weight: bold;
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

        input {
            all: unset;
            font-size: 1.2rem;
            color: #c0c0c0;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 0.5rem 1rem;
            box-sizing: border-box;
            cursor: text;
            border: 1px #333 solid;
        }
    }

    button {
        $background: #141414;
        $border: #333;

        all: unset;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        padding: 0.6rem 0.7rem;
        box-sizing: border-box;
        background-color: $background;
        transition: all 0.1s ease-in-out;
        border-radius: 0.7rem;
        border: 1px solid $border;

        &:hover {
            background-color: color.adjust($background, $lightness: 5%);
            border-radius: 0.5rem;
        }
    }
</style>
