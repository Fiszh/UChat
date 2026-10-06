<script lang="ts">
    import { onMount } from "svelte";

    import ChatOverlay from "$components/ChatOverlay.svelte";

    import LoadingUI from "$components/Loading.svelte";

    import { loadingInfo } from "$stores/global";
    import { get } from "svelte/store";
    import { previewMessages } from "$stores/previewMessages";
    import { messages } from "$lib/chat";
    import Slider from "$components/Inputs/Slider.svelte";

    let { data } = $props();

    let LoadingMsg = $state(get(loadingInfo));

    loadingInfo.subscribe((value) => (LoadingMsg = value));

    let mounted = $state(false);

    let interval = $state<ReturnType<typeof setInterval>>();

    function adjustSpeed(e?: Event) {
        clearInterval(interval);

        const value =
            e &&
            e.currentTarget &&
            "value" in (e.currentTarget as HTMLInputElement)
                ? Number((e?.currentTarget as HTMLInputElement).value)
                : 1000;

        interval = setInterval(() => {
            const random =
                previewMessages[
                    Math.floor(Math.random() * previewMessages.length)
                ];

            messages.update((msgs) => [...msgs, random]);
        }, value);
    }

    onMount(() => {
        adjustSpeed();

        mounted = true;
    });
</script>

{#if mounted}
    {#if data.hasChannel}
        <p style="color: black;">Please remove a channel before testing</p>
    {:else}
        <LoadingUI text={LoadingMsg.text} type={LoadingMsg.type} />

        <ChatOverlay />

        <div id="setting">
            <p>Message Time</p>
            <Slider
                value="1000"
                onChange={(e) => {
                    adjustSpeed(e);
                }}
                min="25"
                max="5000"
                displayValue
            />
        </div>
    {/if}
{/if}

<style lang="scss">
    #setting {
        position: fixed;
        bottom: 1rem;
        right: 1rem;

        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        background: rgba(0, 0, 0, 0.5);

        border-radius: 1rem;
    }
</style>
