<script lang="ts">
    import {
        House,
        Info,
        Coffee,
        MessageSquareMore,
        ArrowLeftRight,
        Lightbulb,
        Brush,
        Earth,
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
    import HelpNotice from "$components/helpNotice.svelte";
    import LocalizationDialog from "$components/dialogs/localization.svelte";
    import { locale, t } from "svelte-i18n";

    let username = $state(
        getCookie("twitchUsername") || ("" as string | undefined),
    );
    let twitchID = $state(getCookie("twitchId") || ("" as string | undefined));
    let twitchToken = $state(
        getCookie("twitchToken") || ("" as string | undefined),
    );

    let localizationDialog = $state(false);

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

    let relativeTime = $derived(
        moment(__BUILD_DATE)
            .locale($locale ?? "en")
            .fromNow(),
    );
</script>

<LocalizationDialog bind:show={localizationDialog} />

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
{#snippet GlobeIcon()}
    <Earth size={$isMobile ? "15" : "20"} />
{/snippet}

{#snippet sideBarButton(
    href: string | (() => void),
    icon: Snippet,
    name: string,
    newTab?: boolean,
)}
    <Button
        href={typeof href === "string" ? href : undefined}
        onclick={typeof href === "function" ? href : undefined}
        target={newTab ? "_blank" : ""}
        rel={newTab ? "noopener noreferrer" : ""}
        class={typeof href === "string" && page.route.id == href
            ? "active"
            : ""}
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
            <h1>
                {$t("branding.tagline", {
                    values: {
                        name: "UChat",
                    },
                })}
            </h1>
            <small id="version_text">
                {__APP_VERSION}
                {dev ? "DEV" : ""}
                {__DEBUG__ ? "DEBUG" : ""}
            </small>
        </div>
    </header>

    <nav>
        {@render sideBarButton("/", HouseIcon, $t("sidebar.home"))}
        {@render sideBarButton(
            "/message-creator",
            MessageSquareMoreIcon,
            $isMobile
                ? $t("sidebar.message_creator.mobile")
                : $t("sidebar.message_creator.pc"),
        )}
        {@render sideBarButton(
            "/convert",
            ArrowLeftRightIcon,
            $t("sidebar.convert"),
        )}
        {@render sideBarButton(
            () => (localizationDialog = true),
            GlobeIcon,
            $isMobile
                ? $t("sidebar.language.mobile")
                : $t("sidebar.language.pc"),
        )}
        {#if dev}
            {@render sideBarButton("/design", DesignIcon, "Design")}
            {@render sideBarButton("/teapot", CoffeeIcon, "Teapot")}
        {/if}
        {@render sideBarButton(
            "/help",
            InfoIcon,
            $isMobile ? $t("sidebar.info.mobile") : $t("sidebar.info.pc"),
        )}
        {@render sideBarButton(
            "https://github.com/Fiszh/UChat/issues/new",
            SuggetsionsIcon,
            $isMobile
                ? $t("sidebar.suggestions.mobile")
                : $t("sidebar.suggestions.pc"),
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
            $t("sidebar.support"),
            true,
        )}
    </nav>

    <footer>
        <section id="account" aria-label="User account section">
            <LoginButton onToken={handleToken} onLogOut={logOut} />
            <p class="note">{$t("footer.login_note")}</p>
            <p class="note">{$t("footer.token_note")}</p>

            <HelpNotice />
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
                {relativeTime}, commit: #{__COMMIT_HASH.slice(0, 7)}
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

            gap: 0.5rem;

            padding: 0.75rem;
            box-sizing: border-box;

            border-bottom: 1px solid #242424;
            background-color: rgba(0, 0, 0);

            h1 {
                font-size: 0.6em;
                margin: 0;
                padding: 0;
            }

            small {
                font-size: 0.7rem;
            }

            #name {
                display: flex;
                flex-direction: column;
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
