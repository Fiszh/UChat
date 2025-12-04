<script lang="ts">
  import { onMount } from "svelte";

  import ChatDisplay from "./ChatDisplay.svelte";

  import { globals, loadingInfo } from "$stores/global";
  import { connectionStatus, connect } from "$stores/chat";

  import { getMainUser, connectToWS } from "$lib/overlayIndex";
  import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";
  import { getFFZBadges } from "$lib/badges";
  import { settings } from "$stores/settings";

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
      await getFFZBadges();

      await getGlobalEmotes();

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

        await getChannelEmotesViaTwitchID(globals.channelTwitchID);

        await connectToWS();
      }

      loadingInfo.set({ text: undefined, type: undefined });

      console.log(globals);
    })();
  });
</script>

<ChatDisplay />

<style lang="scss">
  :global(body) {
    background-color: rgba(0, 0, 0, 0) !important;
  }
</style>
