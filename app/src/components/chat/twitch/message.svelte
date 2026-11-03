<script lang="ts">
    import { cleanUpSharedChat } from "#lib/overlayIndex.js";
    import { getChannelEmotesViaTwitchID } from "#lib/emotes/main.js";
    import MessageWrapper from "../messageWrapper.svelte";
    import { onMount, type ComponentProps } from "svelte";
    import { globals } from "#stores/global.js";
    import { chatSettings } from "#stores/settings.js";

    let { ...rest }: ComponentProps<typeof MessageWrapper> = $props();

    let first = $state(false);

    onMount(() => {
        if (rest["room_id"]) {
            if (
                String(rest["room_id"]) != globals["channels"]["TWITCH"]["ID"]
            ) {
                getChannelEmotesViaTwitchID(String(rest["room_id"]));
            } else if (
                !rest["tags"]["source-room-id"] &&
                String(rest["room_id"]) == globals["channels"]["TWITCH"]["ID"]
            ) {
                cleanUpSharedChat();
            }
        }

        if ("first-msg" in rest["tags"])
            if ("first-msg" in rest["tags"] && chatSettings["firstMsg"])
                first = rest["tags"]["first-msg"] as boolean;
    });
</script>

<MessageWrapper {...rest} {first} />
