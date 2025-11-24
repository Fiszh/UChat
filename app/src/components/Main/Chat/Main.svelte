<script lang="ts">
    import SettingsDisplay from "./Settings.svelte";
    import ChatDisplay from "./Display.svelte";
</script>

<section>
    <SettingsDisplay/>
    <ChatDisplay/>
</section>

<style>
    section {
        display: flex;
        height: 100dvh;
        width: 100%;
    }
</style>