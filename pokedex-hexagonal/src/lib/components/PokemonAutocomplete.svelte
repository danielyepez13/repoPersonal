<script lang="ts">
  import { debounce } from "$lib/utils/debounce";

  export let value = "";
  export let placeholder = "";
  export let id = "";
  export let label = "";
  export let onSelect: ((pokemon: Pokemon) => void) | null = null;
  export let customClass = "";

  interface Pokemon {
    id: number;
    pokedexNumber: number;
    name: string;
    spriteUrl: string;
    types: Array<{ name: string }>;
  }

  let results: Pokemon[] = [];
  let isOpen = false;
  let isLoading = false;
  let selectedIndex = -1;
  let cache: Map<string, Pokemon[]> = new Map();

  const search = debounce(async (query: string) => {
    // Mínimo 2 caracteres
    if (query.length < 2) {
      results = [];
      isOpen = false;
      return;
    }

    // Verificar caché primero
    if (cache.has(query)) {
      results = cache.get(query) || [];
      isOpen = results.length > 0;
      selectedIndex = -1;
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(
        `/api/pokemon/search?q=${encodeURIComponent(query)}&limit=5`
      );
      results = await response.json();

      // Guardar en caché
      cache.set(query, results);

      isOpen = results.length > 0;
      selectedIndex = -1;
    } catch (error) {
      console.error("Search error:", error);
      results = [];
    } finally {
      isLoading = false;
    }
  }, 300);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    search(value);
  }

  function selectResult(pokemon: Pokemon) {
    value = pokemon.name;
    isOpen = false;
    results = [];
    if (onSelect) {
      onSelect(pokemon);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, -1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectResult(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      isOpen = false;
    }
  }

  function handleBlur() {
    setTimeout(() => {
      isOpen = false;
    }, 200);
  }
</script>

<div class="autocomplete-wrapper {customClass}">
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  <div class="input-container">
    <input
      {id}
      type="text"
      {placeholder}
      {value}
      on:input={handleInput}
      on:keydown={handleKeyDown}
      on:focus={() => (isOpen = results.length > 0)}
      on:blur={handleBlur}
      autocomplete="off"
    />

    {#if isOpen && (results.length > 0 || isLoading)}
      <div class="autocomplete-dropdown">
        {#if isLoading}
          <div class="loading">
            <span class="spinner"></span>
            Buscando...
          </div>
        {:else}
          {#each results as pokemon, idx}
            <button
              type="button"
              class="autocomplete-item"
              class:selected={idx === selectedIndex}
              on:click={() => selectResult(pokemon)}
            >
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                class="pokemon-sprite"
              />
              <div class="item-info">
                <span class="name">{pokemon.name}</span>
                <span class="number">#{pokemon.pokedexNumber}</span>
              </div>
              <div class="types">
                {#each pokemon.types as type}
                  <span class="type-badge" data-type={type.name}
                    >{type.name}</span
                  >
                {/each}
              </div>
            </button>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .autocomplete-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
  }

  :global(.dark) label {
    color: #f0f9ff;
  }

  .input-container {
    position: relative;
    width: 100%;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    color: #1f2937;
    transition: all 0.3s ease;
  }

  :global(.dark) input {
    background: #1e293b;
    border-color: #334155;
    color: #f0f9ff;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  :global(.dark) input:focus {
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 320px;
    overflow-y: auto;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .autocomplete-dropdown {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .autocomplete-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.95rem;
  }

  .autocomplete-item:hover,
  .autocomplete-item.selected {
    background-color: #f3f4f6;
  }

  :global(.dark) .autocomplete-item:hover,
  :global(.dark) .autocomplete-item.selected {
    background-color: #0f172a;
  }

  .pokemon-sprite {
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .name {
    font-weight: 600;
    text-transform: capitalize;
    color: #1f2937;
  }

  :global(.dark) .name {
    color: #f0f9ff;
  }

  .number {
    font-size: 0.8rem;
    color: #6b7280;
  }

  :global(.dark) .number {
    color: #9ca3af;
  }

  .types {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .type-badge {
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .type-badge[data-type="normal"] {
    background: linear-gradient(135deg, #a8a878 0%, #8b8b5f 100%);
  }
  .type-badge[data-type="fire"] {
    background: linear-gradient(135deg, #f08030 0%, #d86820 100%);
  }
  .type-badge[data-type="water"] {
    background: linear-gradient(135deg, #6890f0 0%, #4a7fd0 100%);
  }
  .type-badge[data-type="electric"] {
    background: linear-gradient(135deg, #f8d030 0%, #d8b820 100%);
    color: #333;
  }
  .type-badge[data-type="grass"] {
    background: linear-gradient(135deg, #78c850 0%, #5fa038 100%);
  }
  .type-badge[data-type="ice"] {
    background: linear-gradient(135deg, #98d8d8 0%, #78b8b8 100%);
    color: #333;
  }
  .type-badge[data-type="fighting"] {
    background: linear-gradient(135deg, #c03028 0%, #a01820 100%);
  }
  .type-badge[data-type="poison"] {
    background: linear-gradient(135deg, #a040a0 0%, #803080 100%);
  }
  .type-badge[data-type="ground"] {
    background: linear-gradient(135deg, #e0c068 0%, #c0a850 100%);
    color: #333;
  }
  .type-badge[data-type="flying"] {
    background: linear-gradient(135deg, #a890f0 0%, #8870d0 100%);
  }
  .type-badge[data-type="psychic"] {
    background: linear-gradient(135deg, #f85888 0%, #d85870 100%);
  }
  .type-badge[data-type="bug"] {
    background: linear-gradient(135deg, #a8b820 0%, #889010 100%);
  }
  .type-badge[data-type="rock"] {
    background: linear-gradient(135deg, #b8a038 0%, #988820 100%);
    color: #fff;
  }
  .type-badge[data-type="ghost"] {
    background: linear-gradient(135deg, #705898 0%, #583880 100%);
  }
  .type-badge[data-type="dragon"] {
    background: linear-gradient(135deg, #7038f8 0%, #5820d0 100%);
  }
  .type-badge[data-type="dark"] {
    background: linear-gradient(135deg, #705848 0%, #583030 100%);
  }
  .type-badge[data-type="steel"] {
    background: linear-gradient(135deg, #b8b8d0 0%, #9898b0 100%);
    color: #333;
  }
  .type-badge[data-type="fairy"] {
    background: linear-gradient(135deg, #ee99ac 0%, #cc7788 100%);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1.5rem;
    color: #6b7280;
    font-size: 0.95rem;
  }

  :global(.dark) .loading {
    color: #9ca3af;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  :global(.dark) .spinner {
    border-color: #334155;
    border-top-color: #60a5fa;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Estilos para header */
  :global(.header-search) input {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  :global(.header-search) input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  :global(.header-search) input:focus {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  :global(.header-search) .autocomplete-dropdown {
    background: white;
    border-color: #e5e7eb;
  }

  :global(.dark .header-search) .autocomplete-dropdown {
    background: #1e293b;
    border-color: #334155;
  }
</style>
