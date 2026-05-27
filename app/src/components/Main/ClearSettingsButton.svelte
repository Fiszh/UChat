<script lang="ts">
    import { RotateCcw } from "lucide-svelte";

    import { messages } from "$lib/chat";

    import {
        channelID,
        channelName,
        configs,
        settings,
        settingsParams,
    } from "$stores/settings";

    import { previewMessages } from "$stores/previewMessages";
    import { icon_size } from "$stores/global";

    const { onReset }: { onReset?: () => void } = $props();

    const resetSettings = () => {
        channelName.set("");
        channelID.set("");

        settings.set(configs.map((c) => ({ ...c })));
        settingsParams.set({});

        messages.set(previewMessages);

        if (onReset) onReset();
    };
</script>

<button onclick={() => resetSettings()} title="Reset Settings">
    <RotateCcw size={$icon_size} />
</button>

<style lang="scss">
    button {
        all: unset;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;

        &:hover {
            transform: rotate(-30deg);
        }
    }
</style>
