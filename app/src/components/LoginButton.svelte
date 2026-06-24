<script lang="ts">
    import { onMount } from "svelte";

    import { LogIn, LogOut } from "@lucide/svelte";

    import { delCookie, getCookie, setCookie } from "$lib/cookie";
    import Button from "./Inputs/Button.svelte";

    type Props = { onToken: (token: string) => void; onLogOut: () => void };

    const { onToken, onLogOut }: Props = $props();

    let hasToken = $derived(getCookie("twitchToken"));

    const clientId = "11pghkhf9gq7dke49sw1pmumjcthma";
    const redirectUri = `${window.location.origin}/auth`;
    const scope = "user:read:email";

    function openTwitchPopup() {
        if (hasToken) {
            hasToken = "";
            delCookie("twitchToken");
            return onLogOut();
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

{#snippet LogInIcon()}
    <LogIn size="17" />
{/snippet}
{#snippet LogOutIcon()}
    <LogOut size="17" />
{/snippet}

<Button
    icon={hasToken ? LogOutIcon : LogInIcon}
    secondary
    wide
    center
    aria-label="Login"
    onclick={openTwitchPopup}
>
    {#if hasToken}
        Logout
    {:else}
        Login
    {/if}
</Button>
