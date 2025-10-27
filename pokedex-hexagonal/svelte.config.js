import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '$lib': 'src/lib',
      '$domain': 'src/domain',
      '$application': 'src/application',
      '$infrastructure': 'src/infrastructure',
      '$interfaces': 'src/interfaces',
      '$core': 'src/core',
      '$config': 'src/config'
    }
  }
};

export default config;
