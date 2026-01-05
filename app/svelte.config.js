import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: true
		}),
		alias: {
			$stores: path.resolve('./src/stores'),
			$components: path.resolve('./src/components'),
			"app.css": path.resolve('./src/app.css')
		}
	}
};

export default config;
