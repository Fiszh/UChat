<script lang="ts">
    import Button from "$components/Inputs/Button.svelte";
    import { parseSavedSettings } from "$lib/overlayIndex";
    import { savedSettings, settings } from "$stores/settings";
    import { slide } from "svelte/transition";

    type Props = {
        name: string;
        token: string;
        user_id: string;
    };

    let { name, token, user_id }: Props = $props();

    async function getSettings() {
        const response = await fetch(
            `https://api.unii.dev/settings/${user_id}`,
        );

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.settings) {
                savedSettings.set(data.settings);

                parseSavedSettings(data.settings);
            }
        }
    }

    $effect(() => {
        if (user_id) getSettings();
    });

    async function save() {
        if (!token) return alert("You are not logged in");

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
                    if (setting.type == "text" && setting.list) {
                        return [
                            setting.param,
                            setting.value.split(" ").filter(Boolean),
                        ];
                    }
                    return [setting.param, setting.value];
                }),
        );

        if (!Object.keys(mappedSettings).length)
            return alert("No settings changed");

        const saveSettings_response = await fetch(
            "https://api.unii.dev/settings",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": `Bearer ${token}`,
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
        if (!token) return alert("You are not logged in");

        const deleteSettings_response = await fetch(
            "https://api.unii.dev/settings",
            {
                method: "DELETE",
                headers: {
                    "x-auth-token": `Bearer ${token}`,
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

<p id="settings_text" transition:slide>{name} Settings</p>
<div id="settingsButtons" transition:slide>
    <Button approve wide onclick={save}>Save</Button>
    <Button danger wide onclick={deleteSettings}>Delete</Button>
</div>

<style>
    #settingsButtons {
        display: flex;
        gap: 0.5rem;
        width: 100%;
    }
</style>
