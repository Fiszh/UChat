<script lang="ts">
    import { onMount } from "svelte";

    import { LogIn, LogOut } from "lucide-svelte";

    import { delCookie, getCookie, setCookie } from "$lib/cookie";

    export let onToken: (token: string) => void;
    export let onLogOut: () => void;

    $: hasToken = getCookie("twitchToken");

    const clientId = "11pghkhf9gq7dke49sw1pmumjcthma";
    const redirectUri = `${window.location.origin}/auth`;
    const scope = "user:read:email";

    function openTwitchPopup() {
        if (hasToken) {
            hasToken = "";
            delCookie("twitchToken");
            onLogOut();
            return;
        }

        const oauthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;

        const width = 500;
        const height = 700;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;

        window.open(
            oauthUrl,
            "TwitchLogin",
            `width=${width},height=${height},left=${left},top=${top}`,
        );
    }

    onMount(() => {
        window.addEventListener("message", (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.twitchToken) {
                hasToken = event.data.twitchToken;
                setCookie("twitchToken", event.data.twitchToken, 1);
                onToken?.(event.data.twitchToken);
                console.log("Token saved!");
            }
        });
    });
</script>

<button id="login-button" aria-label="Login" on:click={openTwitchPopup}
    >{#if hasToken}
        <LogOut size="17" />
        Logout
    {:else}
        <LogIn size="17" />
        Login
    {/if}</button
>

<style lang="scss">
    @use "sass:color";

    button {
        $background: #141414;
        $border: #333;

        all: unset;
        cursor: pointer;
        width: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        padding: 0.6rem 0.7rem;
        box-sizing: border-box;
        background-color: $background;
        transition: all 0.1s ease-in-out;
        border-radius: 0.7rem;
        border: 1px solid $border;

        &:hover {
            background-color: color.adjust($background, $lightness: 5%);
            border-radius: 0.5rem;
        }

        &:hover:not(.settingsButton) {
            width: 100%;
            border-color: color.adjust($border, $lightness: 5%);
        }
    }
</style>
