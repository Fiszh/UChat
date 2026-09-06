<script lang="ts">
    type Props = { fontName: string };

    let { fontName = "Geist" }: Props = $props();

    let fontUrl = $state("");
    let timeoutId: ReturnType<typeof setTimeout>;

    $effect(() => {
        const name = fontName;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fontUrl = `https://fonts.googleapis.com/css2?family=${name.replace(/\s+/g, "+")}:wght@400;700&display=swap`;
        }, 500);

        return () => clearTimeout(timeoutId);
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
