<script lang="ts">
    import { get } from "svelte/store";

    import { parseSavedSettings } from "$lib/overlayIndex";

    import {
        savedSettings,
        type Setting,
        settings,
        settingsParams,
    } from "$stores/settings";

    let usingID = false;

    const rawLocalSettings = localStorage.getItem("local-settings");
    const LocalSettings = rawLocalSettings
        ? JSON.parse(rawLocalSettings)
        : null;

    if (LocalSettings) {
        parseSavedSettings(LocalSettings);
    }

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

{#snippet booleanSetting(param: string, defaultValue: boolean, value: boolean)}
    <input
        type="checkbox"
        checked={defaultValue != value ? value : defaultValue}
        class:active={value}
        on:change={(e) => handleInput(param, e.currentTarget.checked)}
    />
{/snippet}

{#snippet textSetting(param: string, defaultValue: number, value: number)}
    <input
        type="text"
        placeholder={String(defaultValue)}
        value={defaultValue != value ? value : ""}
        on:input={(e) =>
            handleInput(param, e.currentTarget.value, typeof defaultValue)}
    />
{/snippet}

<div id="settings">
    <section id="config">
        {#each $settings as setting, i (i)}
            <div class="setting-display">
                <p class="setting-name">
                    {@html setting.name.replace(
                        /\(([^)]+)\)/g,
                        "<small>($1)</small>",
                    )}
                </p>
                {#if setting.type == "boolean"}
                    {@render booleanSetting(
                        setting.param,
                        setting.default as boolean,
                        setting.value as boolean,
                    )}
                {:else if setting.type == "number" || setting.type == "text"}
                    {@render textSetting(
                        setting.param,
                        setting.default as number,
                        setting.value as number,
                    )}
                {:else}
                    <strong>{setting.type}</strong> {@html "is a unknown type"}
                {/if}
            </div>
        {/each}
    </section>
    <p>↓ Channel Info ↓</p>
    <section id="channel">
        <label>
            <input
                type="checkbox"
                id="channel-id-check"
                bind:checked={usingID}
            /> Use Channel ID
        </label>

        {#if usingID}
            <input
                placeholder="Channel ID"
                bind:value={localChannelID}
                on:input={(e) =>
                    (localChannelID = validateInput(
                        e.currentTarget.value,
                        "number",
                    ))}
            />
        {:else}
            <input
                placeholder="Channel Name"
                bind:value={localChannelName}
                on:input={(e) =>
                    (localChannelName = validateInput(
                        e.currentTarget.value,
                        "twitch_name",
                    ))}
            />
        {/if}
    </section>
</div>

<style lang="scss">
    #settings {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        background-color: rgba(255, 255, 255, 0.021);

        border-right: #333 1px solid;

        #config {
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;

            padding: 0.5rem 0.7rem;
            box-sizing: border-box;

            gap: 0.3rem;
        }

        & > p {
            margin: 0;
            padding: 0.5rem 0rem;
            box-sizing: border-box;

            text-align: center;
            font-weight: bold;

            border-top: #333 1px solid;
            background-color: rgba(255, 255, 255, 0.05);
        }

        #channel {
            width: 100%;
            font-size: 2rem;
            font-weight: bold;
            padding: 1rem 0.7rem;
            box-sizing: border-box;
            position: relative;
            background-color: rgba(255, 255, 255, 0.014);
            border-top: #333 1px solid;

            label {
                user-select: none;
                font-size: 1rem;
                top: 0;
                right: 0;
                position: absolute;
                background-color: #0e0e0e;
                padding: 0.3rem 0.2rem;
                box-sizing: border-box;
                border-bottom: 1px solid #333;
                border-left: 1px solid #333;
            }

            & > input {
                all: unset;
                width: 100%;
                height: 100%;
            }
        }
    }

    .setting-display {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 1rem;
        padding: 0rem 0.7rem;
        box-sizing: border-box;

        border-bottom: 1px solid;
        border-image: linear-gradient(
                to right,
                #33333300 5%,
                #333 20%,
                #333 80%,
                #33333300 95%
            )
            1;

        &:last-child {
            border: none;
        }

        .setting-name {
            display: inline-flex;
            align-items: flex-end;
            gap: 0.3rem;
        }

        input[type="text"] {
            color: white;
            width: 25%;
            border-radius: 0.5rem;
            border: none;
            background-color: rgba(255, 255, 255, 0.057);
            font-size: 25px;
            text-align: center;
            outline: none;
        }

        input[type="checkbox"] {
            appearance: none;
            display: block;
            min-width: 60px;
            height: 30px;
            background-color: rgba(255, 255, 255, 0.096);
            border-radius: 30px;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s;

            &::after {
                content: "";
                position: absolute;
                width: 26px;
                height: 26px;
                background-color: white;
                border-radius: 50%;
                top: 2px;
                left: 2px;
                transition: transform 0.2s;
            }

            &.active {
                background-color: #4caf50;
            }

            &.active::after {
                transform: translateX(30px);
            }

            &:hover:not(.active) {
                background-color: rgba(255, 255, 255, 0.15);
            }
        }
    }
</style>
