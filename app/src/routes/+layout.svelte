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

	<meta name="robots" content="index, follow" />

	<meta
		name="description"
		content="UChat is a Twitch chat overlay with custom settings, saved preferences, and support for 7TV, BTTV, and FFZ. Copy your overlay URL, reset settings, and preview chat instantly. Works with OBS, Streamlabs, and XSplit."
	/>

	<meta
		name="keywords"
		content="Twitch chat overlay, overlay URL, chat settings, saved preferences, reset settings, invalid URL, channel name, Twitch emotes, 7TV, BetterTTV, FrankerFaceZ"
	/>

	<meta
		property="og:title"
		content="UChat Twitch Chat Overlay Setup • uniiDev"
	/>
	<meta
		name="twitter:title"
		content="UChat Twitch Chat Overlay Setup • uniiDev"
	/>
	<meta
		property="og:description"
		content="UChat is a custom Twitch chat overlay with support for 7TV, BetterTwitchTV, and FrankerFaceZ."
	/>
	<meta property="og:url" content="https://chat.unii.dev" />
	<meta property="og:image" content="https://cdn.unii.dev/uchat/logo.png" />
	<meta
		name="twitter:image"
		content="https://cdn.unii.dev/uchat/twitter.png"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="theme-color" content="#43B581" />
	<link rel="canonical" href="https://chat.unii.dev" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
	/>

	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "uniiDev",
			"url": "https://chat.unii.dev",
			"sameAs": [
				"https://github.com/Fiszh/UChat",
				"https://twitch.tv/uniiDev",
				"https://discord.com/users/703639905691238490"
			]
		}
	</script>
</svelte:head>

{@render children()}
