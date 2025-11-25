<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import PokemonAutocomplete from "$lib/components/PokemonAutocomplete.svelte";

  let isDark = true;
  let searchQuery = "";

  interface Pokemon {
    id: number;
    pokedexNumber: number;
    name: string;
    spriteUrl: string;
    types: Array<{ name: string }>;
  }

  function toggleTheme() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  function handlePokemonSelect(pokemon: Pokemon) {
    searchQuery = "";
    goto(`/pokemon/${pokemon.pokedexNumber}`);
  }

  // Set initial theme from localStorage or system preference
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
</script>

<div
  class="min-h-screen bg-surface-50 dark:bg-slate-950 transition-colors duration-300"
>
  <header
    class="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg dark:from-slate-900 dark:to-slate-800 border-b dark:border-slate-700"
  >
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <a href="/" class="btn btn-primary"
          ><h1 class="text-2xl font-bold text-white">Pokédex</h1></a
        >

        <div class="flex-1 max-w-md">
          <PokemonAutocomplete
            id="header-search"
            placeholder="Buscar Pokémon..."
            bind:value={searchQuery}
            onSelect={handlePokemonSelect}
            customClass="header-search"
          />
        </div>

        <button
          on:click={toggleTheme}
          class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {#if isDark}
            <span class="text-2xl">☀️</span>
          {:else}
            <span class="text-2xl">🌙</span>
          {/if}
        </button>
      </div>
    </div>
  </header>

  <main class="container mx-auto p-4">
    <slot />
  </main>
</div>
