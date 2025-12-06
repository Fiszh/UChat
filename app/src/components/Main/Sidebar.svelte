<script lang="ts">
    import { House, Info, Github, Coffee } from "lucide-svelte";

    import LoginButton from "$components/LoginButton.svelte";
    import GlobalSettings from "./GlobalSettings.svelte";

    import { valideToken } from "$lib/services/twitch";
    import { delCookie, getCookie, setCookie } from "$lib/cookie";

    import { overlayVersion } from "$stores/settings";

    $: version_text = $overlayVersion;

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
    }
</script>

<aside>
    <header id="topbar">
        <img
            class="logo"
            src="https://cdn.unii.dev/uchat/logo.avif"
            alt="UChat Logo"
        />
        <div id="name">
            <strong>UChat</strong>
            <h1 style="font-size:0.8rem; line-height: 1px;">
                UChat Chat Overlay for Twitch
            </h1>
            <small id="version_text">{version_text}</small>
        </div>
    </header>

    <nav>
        <a href="/#" class="active" bind:this={navLinks["home"]["navLink"]}>
            <House size="20" /> Home
        </a>
        <!-- <a href="convert/" target="_blank" rel="noopener noreferrer">
            <RefreshCcw size="20" /> Invalid URL
        </a> -->
        <a href="#help" bind:this={navLinks["help"]["navLink"]}>
            <Info size="20" /> Info & Privacy
        </a>
        <a
            href="https://github.com/Fiszh/UChat"
            target="_blank"
            rel="noopener noreferrer"
        >
            <Github size="20" /> GitHub
        </a>
        <a
            href="https://buymeacoffee.com/jzlnkf5qgo"
            target="_blank"
            rel="noopener noreferrer"
        >
            <Coffee size="20" /> Support
        </a>
    </nav>

    <section id="account" aria-label="User account section">
        <LoginButton onToken={handleToken} onLogOut={logOut} />
        <p class="note">Login is not required.</p>
        <p class="note">
            Your token is only shared to validate and never stored on the
            server.
        </p>
        <a href="#help-notice">[Learn more]</a>
        {#if username} 
            <GlobalSettings
                user={{
                    name: username || "",
                    token: twitchToken || "",
                    user_id: twitchID || "",
                }}
            />
        {/if}
    </section>
</aside>

<style lang="scss">
    @use "sass:color";

    aside {
        user-select: none;
        border-right: 1px solid #333;
        min-width: 17rem;
        max-width: 17rem;
        width: 100%;
        position: relative;
        height: 100dvh;

        header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 0.7rem 1rem;
            box-sizing: border-box;

            border-bottom: 1px solid #333;
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
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.6rem 0.7rem;
            box-sizing: border-box;

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

                &:hover {
                    transform: scale(1.05);
                    background-color: rgb(20, 20, 20);
                }

                &.active {
                    transform: scale(1.05);
                    background-color: rgb(24, 24, 24);
                    border: 1px solid #333;
                }
            }
        }

        #account {
            padding: 0.7rem;
            box-sizing: border-box;
            border-top: 1px solid #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            position: absolute;
            bottom: 0;

            p {
                margin: 0.3rem;
            }
        }
    }
</style>
