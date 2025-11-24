<script lang="ts">
    import { onMount } from "svelte";

    import SettingsDisplay from "./Settings.svelte";
    import ChatDisplay from "./Display.svelte";

    import { getBadges } from "$lib/preview";
    import SevenTV_main from "$lib/services/7TV/main";
    
    import { previewMessages } from "$stores/previewMessages";
    import { globals } from "$stores/global";
    import { messages } from "$stores/chat";

    onMount(async () => {
        await getBadges();
        globals.emotes["7TV"].channel["0"] = await SevenTV_main.emoteSet.bySetID("01JGAC1F503T2852YKXC8G9VN1");

        messages.set(previewMessages);
    });
</script>

<section>
    <SettingsDisplay/>
    <ChatDisplay/>
</section>

<style>
    section {
        display: flex;
        height: 100dvh;
        width: 100%;
    }
</style>