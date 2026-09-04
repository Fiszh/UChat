<script lang="ts">
    import { onMount } from "svelte";

    type Props = { fontName: string };

    let { fontName = "Geist" }: Props = $props();

    let fontUrl = $state("");

    onMount(() => {
        const formattedFont = fontName.replace(/\s+/g, "+");
        fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@400;700&display=swap`;

        console.log(fontName);
        console.log(formattedFont);
        console.log(fontUrl);
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="anonymous"
    />
    <link rel="stylesheet" href={fontUrl} />
</svelte:head>
