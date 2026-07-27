<script lang="ts">
    import Dialog from "$components/Dialog.svelte";
    import Button from "$components/Inputs/Button.svelte";
    import Checkbox from "$components/Inputs/Checkbox.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Kick from "$components/logos/kick.svelte";
    import Twitch from "$components/logos/twitch.svelte";
    import { t } from "svelte-i18n";

    type InputMode = "name" | "id" | string; // im to lazy to fix this rn so i will leave string here

    interface Inputs {
        twitch: {
            input: {
                name: string;
                id: string;
            };
            mode: InputMode;
        };
        kick: {
            input: {
                name: string;
                id: string;
            };
            mode: InputMode;
        };
    }

    type Props = {
        show: boolean;
        inputs: Inputs;
    };

    let { show = $bindable(false), inputs = $bindable() }: Props = $props();

    interface PastedName {
        name: string;
        platform: Platforms;
        input: Platforms;
    }

    const emptyPastedName: PastedName = {
        name: "",
        platform: "TWITCH",
        input: "TWITCH",
    };

    let pastedName = $state(emptyPastedName);

    function validateInput(value: string, type: string) {
        if (type == "number") {
            return value.replace(/[^0-9]+/g, "");
        } else if (type == "twitch_name") {
            return value.replace(/[^a-zA-Z0-9_]+/g, "");
        } else if (type == "kick_name") {
            return value.replace(/[^a-zA-Z0-9-]+/g, "");
        }
        return value;
    }

    function checkForChannelLink(e: ClipboardEvent) {
        if (e.clipboardData && e.target instanceof HTMLInputElement) {
            const pastedText = e.clipboardData.getData("text").trim();

            let pasted_url: URL;
            try {
                pasted_url = new URL(pastedText);
            } catch {
                return;
            }

            const pastedUsername = pasted_url.pathname
                .split("/")
                .filter(Boolean)[0];

            if (!pastedUsername) return;

            if (pasted_url.host.endsWith("twitch.tv")) {
                pastedName = {
                    name: pastedUsername,
                    platform: "TWITCH",
                    input: e.target.dataset.platform as Platforms,
                };
            } else if (pasted_url.host.endsWith("kick.com")) {
                pastedName = {
                    name: pastedUsername,
                    platform: "KICK",
                    input: e.target.dataset.platform as Platforms,
                };
            }
        }
    }

    const toTitleCase = (str: string): string =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    function setPastedName() {
        if (pastedName["platform"] == "TWITCH")
            inputs["twitch"]["input"]["name"] = pastedName["name"];

        if (pastedName["platform"] == "KICK")
            inputs["kick"]["input"]["name"] = pastedName["name"];

        if (pastedName["input"] != pastedName["platform"]) {
            inputs[pastedName["input"].toLowerCase() as Lowercase<Platforms>][
                "input"
            ]["name"] = "";
        }

        pastedName = emptyPastedName;
    }
</script>

{#snippet channelLinkButtons()}
    <Button onclick={() => (pastedName = emptyPastedName)}>
        {$t("labels.cancel")}
    </Button>

    <Button primary onclick={setPastedName}>{$t("labels.confirm")}</Button>
{/snippet}

<Dialog
    name={$t("dialogs.channel_link.title")}
    show={pastedName["name"].length > 0}
    buttons={channelLinkButtons}
    onClose={() => (pastedName = emptyPastedName)}
    index={1}
>
    <h3>
        {$t("dialogs.channel_link.description", {
            values: { platform: toTitleCase(pastedName["platform"]) },
        })}
    </h3>
    <p>
        {$t("dialogs.channel_link.channel_confirm", {
            values: {
                platformChange:
                    pastedName["platform"] == pastedName["input"]
                        ? ""
                        : $t("dialogs.channel_link.platform_change", {
                              values: {
                                  platform: toTitleCase(pastedName["platform"]),
                              },
                          }),
                name: pastedName["name"],
            },
        })}
    </p>
</Dialog>

<Dialog bind:show name="Manage Channels">
    <div id="layout">
        <section>
            <p>
                <Twitch brandColor />
                Twitch
            </p>

            {#if inputs.twitch.mode === "name"}
                <Input
                    bind:value={inputs["twitch"]["input"]["name"]}
                    placeholder="Channel name..."
                    data-platform="TWITCH"
                    invalid={!inputs["twitch"]["input"]["name"].length}
                    onPaste={checkForChannelLink}
                    onChange={(e) =>
                        (inputs["twitch"]["input"]["name"] = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "twitch_name",
                        ))}
                />
            {:else}
                <Input
                    bind:value={inputs["twitch"]["input"]["id"]}
                    placeholder="Channel ID..."
                    invalid={!inputs["twitch"]["input"]["id"].length}
                    onChange={(e) =>
                        (inputs["twitch"]["input"]["id"] = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "number",
                        ))}
                />
            {/if}

            <Checkbox
                checked={inputs.twitch.mode === "id"}
                onchange={(e) =>
                    (inputs.twitch.mode = (e.target as HTMLInputElement).checked
                        ? "id"
                        : "name")}
            >
                Use Channel ID
            </Checkbox>
        </section>

        <section>
            <p>
                <Kick brandColor />
                Kick
            </p>

            {#if inputs.kick.mode === "name"}
                <Input
                    bind:value={inputs["kick"]["input"]["name"]}
                    placeholder="Channel name..."
                    data-platform="KICK"
                    invalid={!inputs["kick"]["input"]["name"].length}
                    onPaste={checkForChannelLink}
                    onChange={(e) =>
                        (inputs["kick"]["input"]["name"] = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "kick_name",
                        ))}
                />
            {:else}
                <Input
                    bind:value={inputs["kick"]["input"]["id"]}
                    placeholder="Channel ID..."
                    invalid={!inputs["kick"]["input"]["id"].length}
                    onChange={(e) =>
                        (inputs["twitch"]["input"]["id"] = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "number",
                        ))}
                />
            {/if}

            <!-- <Checkbox
                checked={inputs.kick.mode === "id"}
                onchange={(e) =>
                    (inputs.kick.mode = (e.target as HTMLInputElement).checked
                        ? "id"
                        : "name")}
            >
                Use Channel ID
            </Checkbox> -->
        </section>

        <Button primary center onclick={() => (show = false)}>Save</Button>
    </div>
</Dialog>

<style lang="scss">
    #layout {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        section {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            p {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
        }
    }
</style>
