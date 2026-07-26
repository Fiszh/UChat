<script lang="ts">
    import MessageWrapper from "../messageWrapper.svelte";
    import type { ComponentProps } from "svelte";

    type WrapperProps = ComponentProps<typeof MessageWrapper>;
    type Props = Omit<WrapperProps, "tags"> & {
        tags: Record<string, any>;
    };

    let { tags, message_id, room_id, ...rest }: Props = $props();

    // svelte-ignore state_referenced_locally
    const userstate: WrapperProps["tags"] = {
        id: message_id,
        color: tags["identity"]["color"],
        "source-room-id": String(room_id),
        "user-id-raw": String(tags["id"]),
        "user-id": tags["id"],
        username: tags["slug"],
        badges: tags["identity"]["badges"],
        badges_v2: tags["identity"]["badges_v2"],
    };
</script>

<MessageWrapper {...rest} tags={userstate} {message_id} {room_id} />
