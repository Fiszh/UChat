<script lang="ts">
    import {
        House,
        RefreshCcw,
        Info,
        Github,
        Coffee,
        LogIn,
    } from "lucide-svelte";
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
            <small id="version_text">version_text</small>
        </div>
    </header>

    <nav>
        <a href="." class="active" aria-current="page">
            <House size="20" /> Home
        </a>
        <a href="convert/" target="_blank" rel="noopener noreferrer">
            <RefreshCcw size="20" /> Invalid URL
        </a>
        <a href="#help">
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
        <button id="login-button" aria-label="Login"
            ><LogIn size="17" /> Login</button
        >
        <p class="note">Login is not required.</p>
        <p class="note">
            Your token is only shared to validate and never stored on the
            server.
        </p>
        <a href="#help-notice">[Learn more]</a>
        <p id="settings_text">username Settings</p>
        <div id="settingsButtons">
            <button id="save" class="settingsButton">Save</button>
            <button id="delete" class="settingsButton">Delete</button>
        </div>
    </section>
</aside>

<style lang="scss">
    @use "sass:color";

    aside {
        user-select: none;
        border-right: 1px solid #333;
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

            #settingsButtons {
                display: flex;
                width: 100%;
                gap: 0.5rem;

                #save {
                    $background: #4caf50;
                    $border: #2e6e3a;

                    background-color: $background;
                    border: 1px solid $border;

                    &:hover {
                        background-color: color.adjust(
                            $background,
                            $lightness: 5%
                        );
                        border-radius: 0.5rem;
                    }
                }

                #delete {
                    $background: #e53935;
                    $border: #7a2b2b;

                    background-color: $background;
                    border: 1px solid $border;

                    &:hover {
                        background-color: color.adjust(
                            $background,
                            $lightness: 5%
                        );
                        border-radius: 0.5rem;
                    }
                }
            }
        }
    }
</style>
