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
        id: tags["id"],
        "source-room-id": String(0),
        "user-id-raw": String(tags["authorId"]),
        "user-id": tags["authorId"],
        username: tags["author"],
        badges: [],
    };
</script>

<MessageWrapper {...rest} tags={userstate} {message_id} {room_id} />
