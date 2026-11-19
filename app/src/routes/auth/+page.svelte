<script lang="ts">
    import { onMount } from "svelte";

    import "#styles/app.scss";

    onMount(() => {
        const hash = new URLSearchParams(window.location.hash.slice(1));

        const token = hash.get("access_token");
        const state = hash.get("state");
        const storage_state = sessionStorage.getItem("twitchState");

        sessionStorage.removeItem("twitchState");

        if (!storage_state || !state)
            return alert("No state saved, please retry...");

        if (storage_state !== state)
            return alert("Invalid state, please retry...");

        if (!token) return alert("No token received, please retry...");

        if (token && window.opener) {
            window.opener.postMessage(
                { twitchToken: token },
                window.location.origin,
            );
            window.close();
        }
    });
</script>

<p style="color: white;">Logging in...</p>
