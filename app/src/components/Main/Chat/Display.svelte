<script lang="ts">
    import { RotateCcw, Copy, Send } from "lucide-svelte";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";

    import { messages, sanitizeInput } from "$lib/chat";

    import ChatDisplay from "$components/ChatDisplay.svelte";

    import {
        channelID,
        channelName,
        config,
        settings,
        settingsParams,
    } from "$stores/settings";

    import { badges, icon_size } from "$stores/global";
    import { previewMessages } from "$stores/previewMessages";

    let hex = "#191919";
    let urlResults: HTMLElement | undefined = undefined;

    $: params = new URLSearchParams(
        Object.entries($settingsParams).map(([k, v]) => [
            k,
            String(typeof v == "boolean" ? Number(v) : v),
        ]),
    );

    const resetSettings = () => {
        channelName.set("");
        channelID.set("");

        settings.set(config.map((c) => ({ ...c })));
        settingsParams.set({});

        params.forEach((_, key) => params.delete(key));

        messages.set(previewMessages);

        hex = "#191919";
    };

    function copyUrl() {
        if (urlResults && urlResults.textContent) {
            if ($settingsParams["channel"] || $settingsParams["id"]) {
                navigator.clipboard
                    .writeText(urlResults.textContent)
                    .then(() => {
                        alert("Overlay URL has been copied!");
                    })
                    .catch((err) => {
                        console.error("Failed to copy URL: ", err);
                    });
            } else {
                alert("Channel name or id not provided!.");
            }
        }
    }

    function pickRandomBadges(): Record<string, string>[] {
        const count = Math.floor(Math.random() * 2) + 1;
        const shuffled = $badges["TTV"]["global"].sort(
            () => 0.5 - Math.random(),
        );
        return shuffled.slice(0, count);
    }

    function randomString(len: number) {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        let out = "";
        for (let i = 0; i < len; i++) {
            out += chars[Math.floor(Math.random() * chars.length)];
        }
        return out;
    }

    function generateFakeTwitchTags() {
        const username = randomString(5);
        const displayName = username;
        const userId = Math.floor(Math.random() * 1_000_000_000).toString();

        const badgesPicked = pickRandomBadges() as Record<string, string>[];

        const badgesRaw = badgesPicked
            .map((b: Record<string, string>) => {
                const badge_split = b.id.split("_");

                return `${badge_split[0]}/${badge_split[1]}`;
            })
            .join(",");
        const badges_parsed: Record<string, string> = {};
        badgesPicked.forEach((b: Record<string, string>) => {
            const badge_split = b.id.split("_");

            badges_parsed[badge_split[0]] = badge_split[1];
        });

        return {
            username,
            "display-name": displayName,
            "user-id": userId,
            "badges-raw": badgesRaw,
            badges,
            color: null,
            "room-id": "0",
        };
    }

    let customMessageInput: HTMLInputElement;
    function addMessage() {
        if (!customMessageInput) {
            return;
        }

        const tags = generateFakeTwitchTags();
        const message = sanitizeInput(customMessageInput.value);

        if (!message.length) {
            return;
        }

        messages.update((msgs) => [...msgs, { tags, message }]);
    }
</script>

<div id="chat-preview" style="--chat-background: {hex}">
    <p>
        <span>Chat Preview</span>
        <small>Live preview of your settings</small>
    </p>
    <section id="chat-display" class="bg-grid">
        <ChatDisplay />
    </section>
    <section id="bottom">
        <div class="header">
            Chat Preview Settings <button
                on:click={() => resetSettings()}
                title="Reset Settings"><RotateCcw size={$icon_size} /></button
            >
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
                <p class="bottom-input">{hex}</p>
            </div>
        </div>
        <div id="custom-message">
            <small class="title">Custom Message</small>

            <div class="display">
                <input
                    id="message-input"
                    class="bottom-input"
                    bind:this={customMessageInput}
                    placeholder="Message to display..."
                />
                <button id="send" class="bottom-button" on:click={addMessage}
                    ><Send size={$icon_size} /> Send</button
                >
            </div>
        </div>
        <div id="overlay-url">
            <small class="title">Overlay URL</small>

            <div class="display">
                <p id="url-results" class="bottom-input" bind:this={urlResults}>
                    {window.location.origin}/{params.toString().length
                        ? "?"
                        : ""}{params}
                </p>
                <button id="copy" class="bottom-button" on:click={copyUrl}
                    ><Copy size={$icon_size} /> Copy</button
                >
            </div>
        </div>
    </section>
    <span class="note">
        We log IP addresses for abuse prevention.
        <a href="#help-notice">[Learn more]</a>
    </span>
</div>

<style lang="scss">
    @use "sass:color";

    :root {
        --chat-background: #191919;
    }

    #chat-preview {
        max-width: 30rem;
        width: 100%;

        display: flex;
        flex-direction: column;

        height: 100dvh;

        user-select: none;

        background-color: rgba(255, 255, 255, 0.048);

        #chat-display {
            display: flex;
            height: 100%;

            min-height: 0;
        }

        :global(.chat) {
            height: 100% !important;
            padding: 0.2rem 0.4rem;
            box-sizing: border-box;
            position: relative !important;
            background-color: var(--chat-background);
        }

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

            bottom: 0;

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
                    transition: all 0.2s ease-in-out;
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

                .bottom-input {
                    margin: 0;
                    background-color: rgba(255, 255, 255, 0.075);
                    border: #333 1px solid;
                    width: 100%;
                    padding: 0.5rem 0.7rem;
                    box-sizing: border-box;
                    border-radius: 0.5rem;
                    gap: 1px;
                    font-size: 1.15rem;
                    color: white;
                }
            }

            #overlay-url {
                #url-results {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .bottom-button {
                $border: #333;

                all: unset;
                align-items: center;
                display: flex;
                gap: 0.3rem;
                border: $border 1px solid;
                padding: 0.5rem 0.7rem;
                box-sizing: border-box;
                border-radius: 0.7rem;
                cursor: pointer;

                &:hover {
                    border-color: color.adjust($border, $lightness: 15%);
                }
            }
        }
    }

    @media (max-width: 768px) {
        #chat-preview {
            max-width: unset;
            min-width: unset;

            font-size: 0.7rem;

            height: 100%;
            width: 100dvw;

            #bottom .display .bottom-input {
                font-size: 0.7rem;
            }
        }
    }
</style>
