<script lang="ts">
    import { slide } from "svelte/transition";

    export let user: {
        name: string;
        token: string;
    };
</script>

<p id="settings_text" transition:slide>{user.name} Settings</p>
<div id="settingsButtons" transition:slide>
    <button id="save" class="settingsButton">Save</button>
    <button id="delete" class="settingsButton">Delete</button>
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
