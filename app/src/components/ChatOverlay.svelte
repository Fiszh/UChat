<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  import ChatDisplay from "./ChatDisplay.svelte";

  import { globals, loadingInfo } from "$stores/global";
  import { connectionStatus, connect } from "$lib/chat";

  import { getMainUser, connectToWS } from "$lib/overlayIndex";
  import { settings } from "$stores/settings";
  import { loadChat } from "$lib/loadChat";

  let status = "";

  connectionStatus.subscribe((s) => {
    status = s;
  });

  onMount(() => {
    loadingInfo.set({ text: undefined, type: "minimal" });

    const params = new URLSearchParams(window.location.search);
    const channelName = params.get("channel");
    const channelID = params.get("id");

    if (channelName) {
      connect(channelName);
    }

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
      const successGettingUser = await getMainUser(
        channelID ? Number(channelID) : channelName!,
      );

      if (
        successGettingUser &&
        globals.channelTwitchName &&
        globals.channelTwitchID
      ) {
        if (!channelName) {
          connect(globals.channelTwitchName);
        }

        await loadChat();

        await connectToWS();
      }

      loadingInfo.set({ text: undefined, type: undefined });

      console.log(globals);
    })();

    // REFRESH IMAGES IF FAILED
    let interval: ReturnType<typeof setInterval>;

    function handleImageRetries(): void {
      document
        .querySelectorAll<HTMLImageElement>("img")
        .forEach((img, index) => {
          if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            setTimeout(() => {
              img.src =
                img.src.split("?")[0] + "?retry=" + new Date().getTime();
            }, 500 * index);
          }
        });
    }

    onMount(() => {
      interval = setInterval(handleImageRetries, 10000);
    });

    onDestroy(() => {
      clearInterval(interval);
    });
  });
</script>

<ChatDisplay />

<style lang="scss">
  :global(body) {
    background-color: rgba(0, 0, 0, 0) !important;
  }
</style>
