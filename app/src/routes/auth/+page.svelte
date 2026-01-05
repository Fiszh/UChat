<script lang="ts">
    import { onMount } from "svelte";

    import "app.css";

    onMount(() => {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const token = hash.get("access_token");
        if (token && window.opener) {
            window.opener.postMessage(
                { twitchToken: token },
                window.location.origin,
            );
            window.close();
        }
    });
</script>

<p>Logging in...</p>
