<script lang="ts">
    import { onMount } from "svelte";

    import SettingsDisplay from "./Settings.svelte";
    import ChatDisplay from "./Display.svelte";

    import { getBadges } from "$lib/preview";
    import SevenTV_main from "$lib/services/7TV/main";
    import { pushUserInfoViaGQL } from "$lib/services/7TV/cosmetics";

    import { emotes, badges } from "$stores/global";
    import { cosmetics } from "$stores/cosmetics";
    import { messages } from "$lib/chat";
    import { previewMessages } from "$stores/previewMessages";
    import { MessageSquare, Settings } from "lucide-svelte";

    let isMobile: boolean = window.innerWidth <= 768;

    window.addEventListener("resize", () => {
        isMobile = window.innerWidth <= 768;
    });

    let tab: string = "settings";

    onMount(async () => {
        messages.set(previewMessages);

        if (!$badges["TTV"].global.length) {
            await getBadges();
        }

        if (!$emotes["7TV"].channel["0"]?.length) {
            const previewEmotes = await SevenTV_main.emoteSet.bySetID(
                "01JGAC1F503T2852YKXC8G9VN1",
            );

            emotes.update((e) => ({
                ...e,
                "7TV": {
                    ...e["7TV"],
                    channel: {
                        ...e["7TV"].channel,
                        ["0"]: previewEmotes,
                    },
                },
            }));
        }

        if (!$cosmetics.badges.length && !$cosmetics.paints.length) {
            await pushUserInfoViaGQL("01GAK4CXN00002Z53DR6PAWQVE");
            await pushUserInfoViaGQL("01FDSMJ8MG0005Y8ZGBVC26NJ6");
        }
    });

    const changeTab = (setTab: string) => (tab = setTab);
</script>

<section>
    {#if isMobile}
        {#if tab == "settings"}
            <SettingsDisplay />
        {:else}
            <ChatDisplay />
        {/if}
        <footer>
            <button on:click={() => changeTab("settings")}>
                <Settings />
                Settings
            </button>
            <button on:click={() => changeTab("preview")}>
                <MessageSquare />
                Preview
            </button>
        </footer>
    {:else}
        <SettingsDisplay />
        <ChatDisplay />
    {/if}
</section>

<style lang="scss">
    section {
        display: flex;
        height: 100%;
        width: 100%;
    }

    @media (max-width: 768px) {
        section {
            flex-direction: column;
            overflow: hidden;
        }

        footer {
            bottom: 0;
            position: absolute;
            border-top: 1px #333 solid;
            padding: 1rem 2rem 1rem 2rem;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            justify-content: space-evenly;

            button {
                all: unset;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
