<script lang="ts">
    import { get } from "svelte/store";

    import { parseSavedSettings } from "$lib/overlayIndex";

    import Dialog from "$components/Dialog.svelte";

    import { savedSettings, type Setting, settings } from "$stores/settings";
    import Button from "$components/Inputs/Button.svelte";
    import SettingsToggle from "$components/settings/Settings-toggle.svelte";
    import SettingsText from "$components/settings/Settings-text.svelte";
    import SettingsColor from "$components/settings/Settings-color.svelte";
    import { removeParam, setParam } from "$lib/params";

    let showHidden = $state(false);
    let hiddenWarning = $state(false);

    const showHiddenSettings = () => {
        showHidden = true;
        hiddenWarning = true;
    };

    const rawLocalSettings = localStorage.getItem("local-settings");
    const LocalSettings = rawLocalSettings
        ? JSON.parse(rawLocalSettings)
        : null;

    if (LocalSettings) parseSavedSettings(LocalSettings);

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
</script>

<Dialog name="Warning" bind:show={hiddenWarning}>
    Hidden settings are not meant to be used regularly, please keep that in mind
    when enabling them. They can go away any day and may be hidden because they
    are old features or are being replaced.
</Dialog>

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
    }
</style>
