<script lang="ts">
  import { onMount } from "svelte";

  import ChatDisplay from "./ChatDisplay.svelte";

  import { globals, loadingInfo } from "$stores/global";
  import { connectionStatus, connect } from "$stores/chat";

  import { getMainUser, connectToWS } from "$lib/overlayIndex";
  import { getChannelEmotesViaTwitchID, getGlobalEmotes } from "$lib/emotes";

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

    // GET USER INFO AND IF USED CHANNEL ID CONNECT TO IRC
    (async () => {
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
