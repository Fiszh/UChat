<script lang="ts">
    import { RotateCcw, Copy } from "lucide-svelte";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";

    import ChatDisplay from "$components/ChatDisplay.svelte";

    import { settingsParams } from "$stores/settings";

    let hex = "#191919";

    $: params = new URLSearchParams(
        Object.entries($settingsParams).map(([k, v]) => [
            k,
            String(typeof v == "boolean" ? Number(v) : v),
        ]),
    );
</script>

<div id="chat-preview" style="--chat-background: {hex}">
    <p>
        <span>Chat Preview</span>
        <small>Live preview of your settings</small>
    </p>
    <ChatDisplay />
    <section id="bottom">
        <div class="header">
            Chat Preview Settings <button><RotateCcw /></button>
        </div>
        <div id="color-picker">
            <small class="title">Chat Background</small>
            <div class="display">
                <ColorPicker
                    bind:hex
                    components={ChromeVariant}
                    label=""
                    sliderDirection="horizontal"
                    isTextInput={false}
                />
                <p>{hex}</p>
            </div>
        </div>
        <div id="overlay-url">
            <small class="title">Overlay URL</small>

            <div class="display">
                <p id="url-results">
                    {window.location.href}{params.toString().length
                        ? "?"
                        : ""}{params}
                </p>
                <button id="copy"><Copy /> Copy</button>
            </div>
        </div>
    </section>
    <span class="note"
        >We log IP addresses for abuse prevention. <a href="#help-notice"
            >[Learn more]</a
        ></span
    >
</div>

<style lang="scss">
    @use "sass:color";

    :root {
        --chat-background: #191919;
    }

    #chat-preview {
        min-width: 30rem;
        display: flex;
        flex-direction: column;

        background-color: rgba(255, 255, 255, 0.048);

        & > p {
            background-color: rgba(0, 0, 0, 0.5);

            border-bottom: #333 1px solid;
            display: flex;
            flex-direction: column;
            margin: 0;

            padding: 1rem;
            box-sizing: border-box;

            span {
                font-weight: bold;
            }
        }

        .note {
            text-align: center;
            gap: 0.3rem;
        }

        #bottom {
            padding: 0.7rem 1rem;
            box-sizing: border-box;

            border-top: #333 1px solid;

            & > * {
                border-bottom: 1px solid;
                border-image: linear-gradient(
                        to right,
                        #33333300 2.5%,
                        #333 10%,
                        #333 90%,
                        #33333300 97.5%
                    )
                    1;
            }

            & > *:last-child {
                border-bottom: 0;
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 0.7rem;
                box-sizing: border-box;

                button {
                    all: unset;
                    cursor: pointer;
                    transition: all 0.4s ease-in-out;
                    display: flex;
                    align-items: center;

                    &:hover {
                        transform: rotate(-30deg);
                    }
                }
            }

            small {
                color: rgb(156, 156, 156);
            }

            .display {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                padding-bottom: 1rem;
                padding-top: 0.4rem;
                box-sizing: border-box;

                p {
                    margin: 0;
                    background-color: rgba(255, 255, 255, 0.075);
                    border: #333 1px solid;
                    width: 100%;
                    padding: 0.5rem 0.7rem;
                    box-sizing: border-box;
                    border-radius: 0.5rem;
                    gap: 1px;
                }
            }

            #overlay-url {
                button {
                    $border: #333;

                    all: unset;
                    display: flex;
                    gap: 0.3rem;
                    border: $border 1px solid;
                    padding: 0.5rem 0.7rem;
                    box-sizing: border-box;
                    border-radius: 0.5rem;
                    cursor: pointer;

                    &:hover {
                        border-color: color.adjust($border, $lightness: 15%);
                    }
                }
            }
        }
    }

    :global(.chat) {
        height: 100% !important;
        position: relative !important;
        background-color: var(--chat-background);
    }
</style>
