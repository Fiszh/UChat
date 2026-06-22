<script lang="ts">
    import Button from "$components/Inputs/Button.svelte";
    import Dropdown from "$components/Inputs/Dropdown.svelte";
    import { queryLocalFonts, type LocalFontData } from "$lib/fonts";

    let fonts: LocalFontData[] = [];

    async function loadFonts() {
        const fontData = await queryLocalFonts();

        if (Array.isArray(fontData)) fonts = fontData;
    }
</script>

<main>
    <button on:click={loadFonts}> Load My Local Fonts </button>

    {#if Array.isArray(fonts) && fonts.length}
        {#snippet dropdown()}
            {#each fonts as font}
                <Button>{font.fullName} ({font.family})</Button>
            {/each}
        {/snippet}

        <Dropdown {dropdown} />
    {/if}
</main>
