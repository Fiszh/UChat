<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<link
		rel="icon"
		href="https://cdn.unii.dev/uchat/logo.ico"
		type="image/png"
	/>

	<title>UChat - Custom Twitch Chat Overlay by uniiDev</title>
	
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
