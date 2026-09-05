<script lang="ts">
    type Props = { fontName: string };

    let { fontName = "Geist" }: Props = $props();

    let fontUrl = $derived(
        `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;700&display=swap`
    );
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
