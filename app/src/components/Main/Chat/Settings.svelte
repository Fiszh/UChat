<script lang="ts">
    import { get } from "svelte/store";

    import { parseSavedSettings } from "$lib/overlayIndex";

    import SettingsColorPicker from "./SettingsColorPicker.svelte";
    import Dialog from "$components/Dialog.svelte";

    import {
        savedSettings,
        type Setting,
        settings,
        settingsParams,
    } from "$stores/settings";
    import { CircleQuestionMark } from "@lucide/svelte";
    import { isMobile } from "$stores/global";
    import Button from "$components/Inputs/Button.svelte";
    import SettingsToggle from "$components/settings/Settings-toggle.svelte";
    import SettingsText from "$components/settings/Settings-text.svelte";
    import SettingsColor from "$components/settings/Settings-color.svelte";
    import Input from "$components/Inputs/Input.svelte";
    import Checkbox from "$components/Inputs/Checkbox.svelte";

    export let dispayChannelInput: boolean = true;

    let showHidden = false;
    let hiddenWarning = false;

    const showHiddenSettings = () => {
        showHidden = true;
        hiddenWarning = true;
    };

    let usingID = false;

    const rawLocalSettings = localStorage.getItem("local-settings");
    const LocalSettings = rawLocalSettings
        ? JSON.parse(rawLocalSettings)
        : null;

    if (LocalSettings) parseSavedSettings(LocalSettings);

    let localChannelName = "";
    let localChannelID = "";

    $: if (!Object.keys($settingsParams).length) {
        localChannelName = "";
        localChannelID = "";
    }

    function setParam(key: string, value: Setting["value"]) {
        settingsParams.update((arr) => {
            arr[key] = value;

            return arr;
        });
    }

    function removeParam(key: string) {
        settingsParams.update((arr) => {
            const { [key]: _, ...rest } = arr;

            return rest;
        });
    }

    function handleInput(
        param: string,
        value: Setting["value"],
        type?: string,
    ) {
        settings.update((arr) => {
            const found = arr.find((s) => s.param === param);

            if (found) {
                if (
                    type == "number" &&
                    typeof value == "string" &&
                    value.length
                ) {
                    found.value = Number(String(value).replace(/[^0-9]+/g, ""));
                } else if (
                    typeof value == "boolean" ||
                    typeof value == "string"
                ) {
                    found.value = value;
                } else {
                    found.value = found.default as Setting["value"];
                }
            }

            return arr;
        });
    }

    settings.subscribe((arr) => {
        const saved_settings = get(savedSettings);

        for (const setting of arr) {
            if (
                typeof setting.value != undefined &&
                (typeof setting.value == "string" ? setting.value : true) &&
                setting.value !=
                    (saved_settings[setting.param]
                        ? saved_settings[setting.param]
                        : setting.default)
            ) {
                setParam(setting.param, setting.value);
            } else {
                removeParam(setting.param);
            }
        }
    });

    function validateInput(value: string, type: string) {
        if (type == "number") {
            return value.replace(/[^0-9]+/g, "");
        } else if (type == "twitch_name") {
            return value.replace(/[^a-zA-Z0-9_]+/g, "");
        }
        return value;
    }

    $: localChannelName.length && (!localChannelID.length || !usingID)
        ? setParam("channel", String(localChannelName))
        : removeParam("channel");
    $: localChannelID.length && (!localChannelName.length || usingID)
        ? setParam("id", String(localChannelID))
        : removeParam("id");
</script>

<Dialog name="Warning" bind:show={hiddenWarning}>
    Hidden settings are not meant to be used regularly, please keep that in mind
    when enabling them. They can go away any day and may be hidden because they
    are old features or are being replaced.
</Dialog>

{#snippet booleanSetting(param: string, defaultValue: boolean, value: boolean)}
    <input
        type="checkbox"
        checked={defaultValue != value ? value : defaultValue}
        class:active={value}
        onchange={(e) => handleInput(param, e.currentTarget.checked)}
    />
{/snippet}

{#snippet textSetting(param: string, defaultValue: number, value: number)}
    <input
        type="text"
        placeholder={String(defaultValue)}
        value={defaultValue != value ? value : ""}
        oninput={(e) =>
            handleInput(param, e.currentTarget.value, typeof defaultValue)}
    />
{/snippet}

{#snippet colorPickerSetting(param: string, value: string)}
    <p style="all:unset; display:flex; align-items:center;">
        {value}
        <SettingsColorPicker
            onChange={(newHex) => handleInput(param, newHex, "color-picker")}
        />
    </p>
{/snippet}

<div id="settings">
    <section id="config">
        {#each $settings as setting, i (i)}
            {#if !setting.hide || (setting.hide && showHidden)}
                {#if setting.type == "boolean"}
                    <SettingsToggle
                        name={setting.name}
                        description={setting.description}
                        hidden={setting.hide}
                        value={setting.value}
                        onChange={(checked) =>
                            handleInput(setting.param, checked)}
                    />
                {:else if setting.type == "text" || setting.type == "number"}
                    <SettingsText
                        name={setting.name}
                        description={setting.description}
                        hidden={setting.hide}
                        defaultValue={setting["default"] || ""}
                        value={setting["default"] != setting.value
                            ? setting.value
                            : ""}
                        onChange={(value) =>
                            handleInput(
                                setting.param,
                                value,
                                typeof setting["default"],
                            )}
                    />
                {:else if setting.type == "color-picker"}
                    <SettingsColor
                        name={setting.name}
                        description={setting.description}
                        hidden={setting.hide}
                        value={setting["default"] != setting.value
                            ? setting.value
                            : setting["default"]}
                        onChange={(value) =>
                            handleInput(setting.param, value, "color-picker")}
                    />
                {/if}

                <hr />
            {/if}
        {/each}

        {#if !showHidden}
            <Button
                id="hidden-settings"
                center
                danger
                onclick={showHiddenSettings}
            >
                Show hidden settings
            </Button>
        {/if}
    </section>
    {#if dispayChannelInput}
        <p>↓ Channel Info ↓</p>
        <section id="channel">
            <span>
                <Checkbox bind:checked={usingID}>Use Channel ID</Checkbox>
            </span>

            {#if usingID}
                <Input
                    placeholder="Channel ID"
                    wide
                    bind:value={localChannelID}
                    oninput={(e) =>
                        (localChannelID = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "number",
                        ))}
                />
            {:else}
                <Input
                    placeholder="Channel Name"
                    wide
                    bind:value={localChannelName}
                    onChange={(e) =>
                        (localChannelName = validateInput(
                            (e.currentTarget as HTMLInputElement).value,
                            "twitch_name",
                        ))}
                />
            {/if}
        </section>
    {/if}
</div>

<style lang="scss">
    #settings {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;

        background-color: rgba(255, 255, 255, 0.021);

        border-right: #242424 1px solid;

        #config {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;

            box-sizing: border-box;

            gap: 0.3rem;
        }

        & > p {
            margin: 0;
            padding-block: 0.25rem;
            box-sizing: border-box;

            text-align: center;

            border-top: #242424 1px solid;
            background-color: rgba(255, 255, 255, 0.05);
        }

        #channel {
            width: 100%;
            font-size: 2rem;
            font-weight: bold;
            box-sizing: border-box;
            position: relative;
            background-color: rgba(255, 255, 255, 0.014);
            border-top: #242424 1px solid;

            span {
                user-select: none;
                font-size: 1rem;
                top: 0;
                right: 0;
                position: absolute;
                background-color: #0e0e0e33;
                padding: 0.25rem 0.5rem;
                box-sizing: border-box;
                border-bottom: 1px solid #202020;
                border-left: 1px solid #202020;
            }
        }
    }
</style>
