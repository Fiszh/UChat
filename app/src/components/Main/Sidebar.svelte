<script lang="ts">
    import {
        House,
        Info,
        Coffee,
        MessageSquareMore,
        ArrowLeftRight,
        Lightbulb,
        Bold,
        Brush,
    } from "@lucide/svelte";

    import moment from "moment/min/moment-with-locales";

    import LoginButton from "$components/LoginButton.svelte";
    import GlobalSettings from "./GlobalSettings.svelte";

    import { valideToken } from "$lib/services/twitch";
    import { delCookie, getCookie, setCookie } from "$lib/cookie";

    import { dev } from "$app/environment";
    import { page } from "$app/state";
    import Github from "$components/logos/github.svelte";
    import Button from "$components/Inputs/Button.svelte";
    import { isMobile } from "$stores/global";
    import type { Snippet } from "svelte";
    import UChat from "$components/logos/uchat.svelte";

    let username = $state(
        getCookie("twitchUsername") || ("" as string | undefined),
    );
    let twitchID = $state(getCookie("twitchId") || ("" as string | undefined));
    let twitchToken = $state(
        getCookie("twitchToken") || ("" as string | undefined),
    );

    async function handleToken(token: string) {
        const user_info = await valideToken(token);
        twitchToken = token;

        if (user_info) {
            username = user_info["login"];
            twitchID = user_info["user_id"];

            if (username) {
                setCookie("twitchUsername", username, 1);
                setCookie("twitchId", twitchID, 1);
            }
        }
    }

    function logOut() {
        delCookie("twitchUsername");
        delCookie("twitchId");

        username = undefined;
        twitchID = undefined;
        twitchToken = undefined;
    }

    moment.locale(navigator.language);
</script>

{#snippet HouseIcon()}
    <House size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet MessageSquareMoreIcon()}
    <MessageSquareMore size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet ArrowLeftRightIcon()}
    <ArrowLeftRight size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet InfoIcon()}
    <Info size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet SuggetsionsIcon()}
    <Lightbulb size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet GithubIcon()}
    <Github size={$isMobile ? 15 : 20} />
{/snippet}
{#snippet CoffeeIcon()}
    <Coffee size={$isMobile ? "15" : "20"} />
{/snippet}
{#snippet DesignIcon()}
    <Brush size={$isMobile ? "15" : "20"} />
{/snippet}

{#snippet sideBarButton(
    href: string,
    icon: Snippet,
    name: string,
    newTab?: boolean,
)}
    <Button
        {href}
        target={newTab ? "_blank" : ""}
        rel={newTab ? "noopener noreferrer" : ""}
        class={page.route.id == href ? "active" : ""}
        {icon}
        layout={$isMobile ? "column" : "row"}
        noHover={$isMobile}
    >
        {name}
    </Button>
{/snippet}

<aside>
    <header id="topbar">
        <UChat size={50} brandColor />
        <div id="name">
            <strong>UChat</strong>
            <h1 style="font-size:0.8rem; line-height: 1px;">
                UChat Chat Overlay for Twitch
            </h1>
            <small id="version_text">{__APP_VERSION} {dev ? "DEV" : ""}</small>
        </div>
    </header>

    <nav>
        {@render sideBarButton("/", HouseIcon, "Home")}
        {@render sideBarButton(
            "/message-creator",
            MessageSquareMoreIcon,
            $isMobile ? "Create" : "Message creator",
        )}
        {@render sideBarButton("/convert", ArrowLeftRightIcon, "Convert")}
        {#if dev}
            {@render sideBarButton("/design", DesignIcon, "Design")}
            {@render sideBarButton("/teapot", CoffeeIcon, "Teapot")}
        {/if}
        {@render sideBarButton(
            "/help",
            InfoIcon,
            $isMobile ? "Info" : "Info & Privacy",
        )}
        {@render sideBarButton(
            "https://github.com/Fiszh/UChat/issues/new",
            SuggetsionsIcon,
            $isMobile ? "Ideas" : "Suggestions & Bugs",
            true,
        )}
        {@render sideBarButton(
            "https://github.com/Fiszh/UChat",
            GithubIcon,
            "GitHub",
            true,
        )}
        {@render sideBarButton(
            "https://buymeacoffee.com/jzlnkf5qgo",
            CoffeeIcon,
            "Support",
            true,
        )}
    </nav>

    <footer>
        <section id="account" aria-label="User account section">
            <LoginButton onToken={handleToken} onLogOut={logOut} />
            <p class="note">Login is not required.</p>
            <p class="note">
                Your token is only shared to validate and never stored on the
                server.
            </p>

            <a href="/help#notice">[Learn more]</a>
            {#if username && twitchToken && twitchID}
                <GlobalSettings
                    name={username}
                    token={twitchToken}
                    user_id={twitchID}
                />
            {/if}

            <a
                id="commit"
                href="{__REPO_URL}/commit/{__COMMIT_HASH}"
                target="_blank"
                rel="noopener noreferrer"
            >
                {moment(__BUILD_DATE).fromNow()}, commit: #{__COMMIT_HASH.slice(
                    0,
                    7,
                )}
            </a>
        </section>
    </footer>
</aside>

<style lang="scss">
    @use "sass:color";

    aside {
        user-select: none;
        border-right: 1px solid #242424;
        min-width: 17rem;
        max-width: 17rem;
        position: relative;
        height: 100%;
        width: 100%;

        overflow: hidden;
        display: flex;
        flex-direction: column;

        header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            gap: 0.25rem;

            padding: 0.75rem;
            box-sizing: border-box;

            border-bottom: 1px solid #242424;
            background-color: rgba(0, 0, 0);

            small {
                font-size: 0.7rem;
            }

            #name {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
        }

        nav {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.6rem 0.7rem;
            box-sizing: border-box;

            overflow-y: auto;
        }

        #account {
            padding: 0.7rem;
            box-sizing: border-box;
            border-top: 1px solid #242424;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;

            p {
                margin: 0.3rem;
            }
        }

        #commit {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.35);
        }
    }

    @media (max-width: 768px) {
        aside > *:not(nav) {
            display: none;
        }

        aside {
            border-top: 1px #161616 solid;
            width: 100%;
            max-width: unset;
            height: unset;

            min-height: fit-content;

            nav {
                flex-direction: row;
                font-size: 0.75rem;
                gap: unset;
                justify-content: space-evenly;
                overflow-y: hidden;
                overflow-x: auto;
            }
        }
    }
</style>
