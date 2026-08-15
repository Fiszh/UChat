import { messages } from "$lib/chat";
import { ChatListener, getYouTubeLiveVideoId } from "$custom/youtube-chat";

const listener = new ChatListener();

listener.onMessage((message) =>
    messages.update((msgs) => [...msgs.slice(-99), message]),
);

export function startTestWS() {
    getYouTubeLiveVideoId("Cinnabrit").then((livestreamId) => {
        if (livestreamId) listener.start(livestreamId);
    });
}
