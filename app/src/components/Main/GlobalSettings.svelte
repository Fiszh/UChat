<script lang="ts">
    import { parseSavedSettings } from "$lib/overlayIndex";
    import { settings, type Setting } from "$stores/settings";
    import { slide } from "svelte/transition";

    export let user: {
        name: string;
        token: string;
        user_id: string;
    };

    async function getSettings() {
        const response = await fetch(
            `https://api.unii.dev/settings/${user.user_id}`,
        );

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.settings) {
                parseSavedSettings(data.settings);
            }
        }
    }

    $: if (user.user_id) {
        getSettings();
    }

    async function save() {
        if (!user.token) {
            alert("You are not logged in");
            return;
        }

        const mappedSettings = Object.fromEntries(
            $settings
                .filter((setting) => {
                    return !(
                        typeof setting.value === "undefined" ||
                        (typeof setting.value === "string" &&
                            !setting.value.length) ||
                        setting.value == setting.default
                    );
                })
                .map((setting) => {
                    if (setting.list) {
                        return [
                            setting.param,
                            String(setting.value).split(" "),
                        ];
                    }
                    return [setting.param, setting.value];
                }),
        );

        if (!Object.keys(mappedSettings).length) {
            alert("No settings changed");
            return;
        }

        const saveSettings_response = await fetch(
            "https://api.unii.dev/settings",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `Bearer ${user.token}`,
                },
                body: JSON.stringify(mappedSettings),
            },
        );

        if (!saveSettings_response.ok) {
            alert("There was a error saving your settings");
        } else {
            const saveSettings_data = await saveSettings_response.json();

            if (!saveSettings_data) {
                alert("No data recived from the server!");
            } else {
                alert(
                    saveSettings_data["message"] || saveSettings_data["error"],
                );
            }
        }
    }

    async function deleteSettings() {
        if (!user.token) {
            alert("You are not logged in");
            return;
        }

        const deleteSettings_response = await fetch(
            "https://api.unii.dev/settings",
            {
                method: "DELETE",
                headers: {
                    "x-auth-token": `Bearer ${user.token}`,
                },
            },
        );

        if (!deleteSettings_response.ok) {
            alert("There was a error deleting your settings");
        } else {
            const deleteSettings_data = await deleteSettings_response.json();

            if (!deleteSettings_data) {
                alert("No data recived from the server!");
            } else {
                alert(
                    deleteSettings_data["message"] ||
                        deleteSettings_data["error"],
                );
            }
        }
    }
</script>

<p id="settings_text" transition:slide>{user.name} Settings</p>
<div id="settingsButtons" transition:slide>
    <button id="save" class="settingsButton" on:click={save}>Save</button>
    <button id="delete" class="settingsButton" on:click={deleteSettings}
        >Delete</button
    >
</div>

<style lang="scss">
    @use "sass:color";

    #settingsButtons {
        display: flex;
        width: 100%;
        gap: 0.5rem;

        button {
            all: unset;
            cursor: pointer;
            width: 95%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;
            padding: 0.6rem 0.7rem;
            box-sizing: border-box;
            transition: all 0.1s ease-in-out;
            border-radius: 0.7rem;
        }

        #save {
            $background: #4caf50;
            $border: #2e6e3a;

            background-color: $background;
            border: 1px solid $border;

            &:hover {
                background-color: color.adjust($background, $lightness: 5%);
                border-radius: 0.6rem;
            }
        }

        #delete {
            $background: #e53935;
            $border: #7a2b2b;

            background-color: $background;
            border: 1px solid $border;

            &:hover {
                background-color: color.adjust($background, $lightness: 5%);
                border-radius: 0.6rem;
            }
        }
    }
</style>
