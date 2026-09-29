<script lang="ts">
    import { onMount } from "svelte";

    import ChatDisplay from "./ChatDisplay.svelte";

    import { globals, loadingInfo } from "$stores/global";
    import { clearChat } from "$lib/chat";

    import { getMainUser, connectToWS } from "$lib/overlayIndex";
    import { settings } from "$stores/settings";
    import { loadChat } from "$lib/loadChat";

    import { isPogly } from "$lib/pogly";
    import { flags } from "$lib/bitmap";

    import Services from "$lib/services";

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
        const YouTubeChannelID = params.get("youtube");

        let loaded = $state<Record<Platforms, boolean | null>>({
            TWITCH: TwitchChannelName || TwitchChannelID ? false : null,
            KICK: KickChannelName ? false : null,
            GOOGLE: YouTubeChannelID ? false : null,
        });

        let allChannelsLoaded = $derived(
            Object.values(loaded).every((c) => c === null || c === true),
        );

        console.log(YouTubeChannelID);

        if (TwitchChannelName || TwitchChannelID) {
            Services["TWITCH"]["ws"].on("open", () => {
                loaded["TWITCH"] = true;

                if (globals["channels"]["TWITCH"]["Name"]) {
                    Services["TWITCH"]["ws"].join(
                        globals["channels"]["TWITCH"]["Name"],
                    );
                }
            });

            if (TwitchChannelName) {
                globals["channels"]["TWITCH"]["Name"] = TwitchChannelName;
                Services["TWITCH"]["ws"].connect();
            }
        }

        if (KickChannelName) {
            Services["KICK"]["ws"].on("first_open", () => {
                if (
                    globals["channels"]["KICK"]["channelID"] &&
                    globals["channels"]["KICK"]["chatroomID"]
                )
                    Services["KICK"]["ws"].subToChannelId(
                        globals["channels"]["KICK"]["channelID"],
                        globals["channels"]["KICK"]["chatroomID"],
                    );
            });
        }

        if (YouTubeChannelID) {
            Services["GOOGLE"]["ws"].on("open", () => {
                loaded["GOOGLE"] = true;

                Services["GOOGLE"]["ws"].subscribe(YouTubeChannelID);
            });

            globals["channels"]["GOOGLE"]["ID"] = YouTubeChannelID;
            Services["GOOGLE"]["ws"].connect();
        }

        for (const [key, value] of params) {
            settings.update((list) =>
                list.map((s) => {
                    if (s["param"] !== key) return s;

                    let v: any = value;

                    if (s["type"] === "number") v = Number(value);
                    if (s["type"] === "boolean") {
                        v = value == "1";
                        if (isPogly()) v = value == "true";
                    }

                    if (s["type"] == "selector" && isPogly()) {
                        const parsedValue: string[] =
                            typeof value == "object"
                                ? value
                                : JSON.parse(value);
                        const mappedSelectors = s["selectors"].map((sl) => ({
                            ...sl,
                            enabled: parsedValue.includes(sl["label"]),
                        }));

                        v = flags.getDefault(mappedSelectors);
                    }

                    return { ...s, value: v };
                }),
            );
        }

        // GET USER INFO AND IF USED CHANNEL ID CONNECT TO IRC
        (async () => {
            if (TwitchChannelName || TwitchChannelName) {
                getMainUser(
                    TwitchChannelID
                        ? Number(TwitchChannelID)
                        : TwitchChannelName!,
                ).then((success) => {
                    if (
                        success &&
                        TwitchChannelID &&
                        !TwitchChannelName &&
                        globals["channels"]["TWITCH"]["Name"]
                    )
                        Services["TWITCH"]["ws"].connect();
                });
            }

            if (KickChannelName) {
                Services["KICK"]["main"]
                    .getUser(KickChannelName)
                    .then((success) => {
                        if (success) {
                            loaded["KICK"] = true;
                            Services["KICK"]["ws"].connect();
                        }
                    });
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

        if (window.obsstudio)
            window.addEventListener("obsStreamingStarting", () =>
                clearChat(true),
            );

        setInterval(handleImageRetries, 10000);
    });
</script>

<ChatDisplay />

<style>
    :global(body, html) {
        background-color: rgba(0, 0, 0, 0) !important;
    }
</style>
