<script lang="ts">
    import { RotateCcw, Copy, Send } from "@lucide/svelte";
    import ColorPicker, { ChromeVariant } from "svelte-awesome-color-picker";

    import { messages, sanitizeInput } from "$lib/chat";

    import ChatDisplay from "$components/ChatDisplay.svelte";

    import {
        channelID,
        channelName,
        configs,
        settings,
        settingsParams,
    } from "$stores/settings";

    import { previewMessages } from "$stores/previewMessages";
    import { sendFakeMessage } from "$lib/preview";
    import Button from "$components/Inputs/Button.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Color from "$components/Inputs/Color.svelte";

    let hex = $state("#191919");
    let customMessageValue = $state("");

    const params = $derived(
        new URLSearchParams(
            Object.entries($settingsParams).map(([k, v]) => [
                k,
                String(typeof v == "boolean" ? Number(v) : v),
            ]),
        ),
    );

    let urlResults: string = $derived(
        window.location.origin +
            "/" +
            (params.toString().length ? "?" : "") +
            params,
    );

    const resetSettings = () => {
        channelName.set("");
        channelID.set("");

        settings.set(configs.map((c) => ({ ...c })));
        settingsParams.set({});

        params.forEach((_, key) => params.delete(key));

        messages.set(previewMessages);

        hex = "#191919";
    };

    function copyUrl() {
        if (urlResults) {
            if ($settingsParams["channel"] || $settingsParams["id"]) {
                navigator.clipboard
                    .writeText(urlResults)
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

    function addMessage() {
        if (!customMessageValue.trim().length) return;

        const message = sanitizeInput(customMessageValue);

        if (!message.length) return;

        sendFakeMessage(message);
    }
</script>

<div id="chat-preview" style="--chat-background: {hex}">
    <section id="top">
        <h4>Chat Preview</h4>
        <small>Live preview of your settings</small>
    </section>
    <section id="chat-display" class="bg-grid">
        <ChatDisplay />
    </section>
    <section id="bottom">
        <span class="header">
            {#snippet icon()}
                <RotateCcw size="20" />
            {/snippet}

            <p>Chat Preview Settings</p>

            <Button
                {icon}
                onclick={() => resetSettings()}
                title="Reset Settings"
            ></Button>
        </span>
        <section id="color-picker">
            <small class="title">Chat Background</small>

            <div class="display">
                <Color bind:value={hex} />
            </div>
        </section>
        <section>
            <small class="title">Custom Message</small>

            <div class="display">
                {#snippet icon()}
                    <Send size="2rem" />
                {/snippet}

                <Input
                    wide
                    bind:value={customMessageValue}
                    placeholder="Message to display..."
                />

                <Button secondary onclick={addMessage} {icon}>Send</Button>
            </div>
        </section>
        <section id="overlay-url">
            <small class="title">Overlay URL</small>

            <div class="display">
                {#snippet icon()}
                    <Copy size="2rem" />
                {/snippet}

                <Input wide readonly bind:value={urlResults} />
                <Button primary onclick={copyUrl} {icon}>Copy</Button>
            </div>
        </section>
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

        height: 100%;

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

        #top {
            background-color: rgba(0, 0, 0, 0.5);

            border-bottom: #242424 1px solid;
            display: flex;
            flex-direction: column;
            margin: 0;

            padding: 1rem;
            box-sizing: border-box;
        }

        .note {
            text-align: center;
        }

        #bottom {
            display: flex;
            flex-direction: column;

            border-top: #242424 1px solid;

            bottom: 0;

            & > * {
                padding: 0.7rem 1rem;
                box-sizing: border-box;
            }

            section {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
                width: 100%;

                .display {
                    display: inline-flex;
                    gap: 0.25rem;
                    width: 100%;
                }
            }

            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 0.7rem;
                box-sizing: border-box;
            }
        }
    }

    @media (max-width: 768px) {
        #chat-preview {
            max-width: unset;
            min-width: unset;

            overflow-y: auto;

            font-size: 0.7rem;

            height: 100%;
            width: 100dvw;
        }
    }
</style>
