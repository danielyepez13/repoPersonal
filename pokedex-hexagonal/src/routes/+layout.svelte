<script lang="ts">
  import "../app.css";

  let isDark = true;
  let searchQuery = "";

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

  function handleSearch(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    const query = target.value;
    if (query.trim()) {
      window.location.href = `/pokemon?search=${encodeURIComponent(query)}`;
    }
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
        <h1 class="text-2xl font-bold text-white">Pokédex</h1>

        <div class="flex-1 max-w-md relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            bind:value={searchQuery}
            on:keydown={(e) => e.key === "Enter" && handleSearch(e)}
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none transition-colors duration-200"
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
