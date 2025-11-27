<script lang="ts">
    import { onMount } from "svelte";

    import SettingsDisplay from "./Settings.svelte";
    import ChatDisplay from "./Display.svelte";

    import { getBadges } from "$lib/preview";
    import SevenTV_main from "$lib/services/7TV/main";
    import { pushUserInfoViaGQL } from "$lib/services/7TV/cosmetics";

    import { emotes, badges } from "$stores/global";
    import { cosmetics } from "$stores/cosmetics";
    import { messages } from "$stores/chat";
    import { previewMessages } from "$stores/previewMessages";

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
</script>

<section>
    <SettingsDisplay />
    <ChatDisplay />
</section>

<style>
    section {
        display: flex;
        height: 100dvh;
        width: 100%;
    }
</style>
