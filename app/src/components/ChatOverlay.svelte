<script lang="ts">
    import { onMount } from "svelte";

    import ChatDisplay from "./ChatDisplay.svelte";

    import { globals, loadingInfo } from "$stores/global";
    import { connect } from "$lib/chat";

    import { getMainUser, connectToWS } from "$lib/overlayIndex";
    import { settings } from "$stores/settings";
    import { loadChat } from "$lib/loadChat";
    import { getKickUser } from "$lib/services/KICK/user";
    import KICKSocket from "$lib/services/KICK/chat";

    // REFRESH IMAGES IF FAILED
    function handleImageRetries(): void {
        document
            .querySelectorAll<HTMLImageElement>("img")
            .forEach((img, index) => {
                if (!img.complete || img.naturalWidth === 0) {
                    setTimeout(() => {
                        img.src =
                            img.src.split("?")[0] +
                            "?retry=" +
                            new Date().getTime();
                    }, 500 * index);
                }
            });
    }

    onMount(() => {
        loadingInfo.set({ text: undefined, type: "minimal" });

        const params = new URLSearchParams(window.location.search);
        const TwitchChannelName = params.get("channel");
        const TwitchChannelID = params.get("id");
        const KickChannelName = params.get("kick");

        let loadedIn = $state({
            twitch: TwitchChannelName || TwitchChannelID ? false : null,
            kick: KickChannelName ? false : null,
        });

        let allChannelsLoaded = $derived(
            Object.values(loadedIn).every((c) => c === null || c === true),
        );

        if (TwitchChannelName) connect(TwitchChannelName);

        for (const [key, value] of params) {
            settings.update((list) =>
                list.map((s) => {
                    if (s.param !== key) return s;

                    let v: any = value;

                    if (s.type === "number") v = Number(value);
                    if (s.type === "boolean") v = value == "1";

                    return { ...s, value: v };
                }),
            );
        }

        // GET USER INFO AND IF USED CHANNEL ID CONNECT TO IRC
        (async () => {
            if (TwitchChannelName || TwitchChannelName) {
                const successGettingUser = await getMainUser(
                    TwitchChannelID
                        ? Number(TwitchChannelID)
                        : TwitchChannelName!,
                );

                if (successGettingUser) {
                    loadedIn["twitch"] = true;

                    if (!TwitchChannelName && globals.channelTwitchName)
                        connect(globals.channelTwitchName);
                }
            }

            if (KickChannelName) {
                const successGettingUser = await getKickUser(KickChannelName);

                if (successGettingUser) {
                    loadedIn["kick"] = true;

                    const KickClient = new KICKSocket();

                    KickClient.on("first_open", () => {
                        if (globals.channelKickID && globals.chatroomKickID)
                            KickClient.subToChannelId(
                                globals.channelKickID,
                                globals.chatroomKickID,
                            );
                    });

                    KickClient.connect();
                }
            }

            await new Promise((resolve) => {
                let cleanup: () => void;

                const timeout = setTimeout(() => {
                    if (cleanup) cleanup();
                    resolve(false);
                }, 60000);

                cleanup = $effect.root(() => {
                    $effect(() => {
                        if (allChannelsLoaded) {
                            clearTimeout(timeout);
                            cleanup();
                            resolve(true);
                        }
                    });
                });
            });

            await loadChat();

            await connectToWS();

            loadingInfo.set({ text: undefined, type: undefined });

            console.log(globals);
        })();

        setInterval(handleImageRetries, 10000);
    });
</script>

<ChatDisplay />

<style lang="scss">
    :global(body) {
        background-color: rgba(0, 0, 0, 0) !important;
    }
</style>
