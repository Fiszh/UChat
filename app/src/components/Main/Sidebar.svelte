<script lang="ts">
    import {
        House,
        Info,
        Coffee,
        MessageSquareMore,
        ArrowLeftRight,
        Lightbulb,
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

    let currentHash = window.location.hash || "#";

    const onHashChange = () => (currentHash = window.location.hash || "#");

    window.addEventListener("hashchange", onHashChange);

    $: username = getCookie("twitchUsername") || ("" as string | undefined);
    $: twitchID = getCookie("twitchId") || ("" as string | undefined);
    $: twitchToken = getCookie("twitchToken") || ("" as string | undefined);

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

    const navLinks = {
        home: {
            navLink: undefined as HTMLElement | undefined,
            hash: ["", "#"],
        },
        msgCreator: {
            navLink: undefined as HTMLElement | undefined,
            hash: ["#message-creator"],
        },
        help: {
            navLink: undefined as HTMLElement | undefined,
            hash: ["#help", "#help-notice"],
        },
    };

    $: {
        for (const navLink of Object.values(navLinks)) {
            const hasHash = navLink.hash.some((h) => h === currentHash);

            if (navLink.navLink instanceof HTMLElement) {
                if (hasHash) {
                    navLink.navLink.classList.add("active");
                } else {
                    navLink.navLink.classList.remove("active");
                }
            }
        }

        const anyHash = Object.values(navLinks).filter((h) =>
            h.hash.includes(currentHash),
        );

        if (
            !anyHash.length &&
            navLinks["home"]["navLink"] instanceof HTMLElement
        )
            navLinks["home"]["navLink"].classList.add("active");
    }

    moment.locale(navigator.language);
</script>

{#snippet HouseIcon()}
    <House size="20" />
{/snippet}
{#snippet MessageSquareMoreIcon()}
    <MessageSquareMore size="20" />
{/snippet}
{#snippet ArrowLeftRightIcon()}
    <ArrowLeftRight size="20" />
{/snippet}
{#snippet InfoIcon()}
    <Info size="20" />
{/snippet}
{#snippet SuggetsionsIcon()}
    <Lightbulb size={20} />
{/snippet}
{#snippet GithubIcon()}
    <Github size={20} />
{/snippet}
{#snippet CoffeeIcon()}
    <Coffee size="20" />
{/snippet}

<aside>
    <header id="topbar">
        <img
            class="logo"
            src="https://chat.unii.dev/images/logo.avif"
            alt="UChat Logo"
        />
        <div id="name">
            <strong>UChat</strong>
            <h1 style="font-size:0.8rem; line-height: 1px;">
                UChat Chat Overlay for Twitch
            </h1>
            <small id="version_text">{__APP_VERSION} {dev ? "DEV" : ""}</small>
        </div>
    </header>

    <nav>
        {#if page.route.id == "/"}
            <Button
                href="/#"
                class="active"
                bind:element={navLinks["home"]["navLink"]}
                icon={HouseIcon}
            >
                Home
            </Button>
            <Button
                href="#message-creator"
                bind:element={navLinks["msgCreator"]["navLink"]}
                icon={MessageSquareMoreIcon}
            >
                Message creator
            </Button>
            <Button href="/convert" icon={ArrowLeftRightIcon}>Convert</Button>
            <Button
                href="#help"
                bind:element={navLinks["help"]["navLink"]}
                icon={InfoIcon}
            >
                Info & Privacy
            </Button>
            <Button
                href="https://github.com/Fiszh/UChat/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                icon={SuggetsionsIcon}
            >
                Suggestions
            </Button>
            <Button
                href="https://github.com/Fiszh/UChat"
                target="_blank"
                rel="noopener noreferrer"
                icon={GithubIcon}
            >
                GitHub
            </Button>
            <Button
                href="https://buymeacoffee.com/jzlnkf5qgo"
                target="_blank"
                rel="noopener noreferrer"
                icon={CoffeeIcon}
            >
                Support
            </Button>
        {:else}
            <Button href="/#" icon={HouseIcon}>Home</Button>
        {/if}
    </nav>

    <footer>
        <section id="account" aria-label="User account section">
            <LoginButton onToken={handleToken} onLogOut={logOut} />
            <p class="note">Login is not required.</p>
            <p class="note">
                Your token is only shared to validate and never stored on the
                server.
            </p>

            <a href="#help-notice">[Learn more]</a>
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

            padding: 0.7rem 1rem;
            box-sizing: border-box;

            border-bottom: 1px solid #242424;
            background-color: rgba(0, 0, 0);

            img {
                max-height: 2.5rem;
            }

            small {
                font-size: 0.7rem;
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

            a {
                all: unset;
                font-weight: bold;
                font-size: 1.3rem;
                cursor: pointer;

                width: 100%;
                display: flex;
                line-height: normal;
                align-items: center;

                gap: 0.5rem;
                padding: 0.6rem 0.7rem;
                box-sizing: border-box;
                transition: all 0.1s ease-in-out;

                border-radius: 0.7rem;

                border: transparent 1px solid;

                &:hover {
                    transform: scale(1.05);
                    background-color: rgb(20, 20, 20);
                }

                &.active {
                    transform: scale(1.05);
                    background-color: rgb(24, 24, 24);
                    border-color: #2c2c2c;
                }
            }
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
        aside {
            position: absolute;
            display: none;
        }
    }
</style>
