<script lang="ts">
  // @ts-ignore
  import type { PageData } from "./$types";
  import { goto } from '$app/navigation';

  export let data: PageData;

  let pokemons: any[] = [];
  let pokemonsLoading = false;
  let pokemonsLoaded = false;
  let isPokemonsExpanded = false;

  async function togglePokemonsExpander() {
    isPokemonsExpanded = !isPokemonsExpanded;
    
    // Si se abre y no hay datos cargados, cargar
    if (isPokemonsExpanded && !pokemonsLoaded && !pokemonsLoading) {
      await loadPokemons();
    }
  }

  async function loadPokemons() {
    if (pokemonsLoaded || pokemonsLoading) return;
    
    pokemonsLoading = true;
    try {
      const response = await fetch(`/pokemon/${data.pokemonId}/moves/${data.moveId}/pokemon`);
      if (response.ok) {
        const result = await response.json();
        pokemons = result.pokemons || [];
        pokemonsLoaded = true;
      }
    } catch (error) {
      console.error('Error loading pokemons:', error);
    } finally {
      pokemonsLoading = false;
    }
  }

  function goToPokemonDetail(pokedexNumber: number) {
    goto(`/pokemon/${pokedexNumber}`);
  }
</script>

{#if data?.move}
  <div class="move-detail-container">
    <a href="/pokemon/{data.pokemonId}" class="back-link">← Volver al Pokémon</a>
    
    <div class="move-header">
      <div class="move-header-info">
        <h1>{data.move.name}</h1>
        
        <div class="move-details">
          <div class="detail-item">
            <span class="label">Tipo:</span>
            <span class="type-badge" data-type={data.move.type?.name || 'normal'}>
              {data.move.type?.name || 'normal'}
            </span>
          </div>
          
          <div class="detail-item">
            <span class="label">Poder:</span>
            <span class="value">{data.move.power || '-'}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">PP:</span>
            <span class="value">{data.move.pp || '-'}</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Precisión:</span>
            <span class="value">{data.move.accuracy || '-'}%</span>
          </div>
          
          <div class="detail-item">
            <span class="label">Prioridad:</span>
            <span class="value">{data.move.priority || 0}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="move-sections">
      <section class="section">
        <button class="expander-header" on:click={togglePokemonsExpander}>
          <span class="expander-icon" class:expanded={isPokemonsExpanded}>▾</span>
          <h2 class="expander-title">
            Pokémon que aprenden este movimiento {pokemons.length > 0 ? `(${pokemons.length})` : ''}
          </h2>
          {#if pokemonsLoading}
            <span class="expander-status">Cargando...</span>
          {/if}
        </button>
        
        {#if isPokemonsExpanded}
          <div class="expander-content">
            {#if pokemonsLoading}
              <div class="loading-state">
                <p>Cargando pokémon...</p>
              </div>
            {:else if pokemons && pokemons.length > 0}
              <div class="pokemons-grid">
                {#each pokemons as pokemon}
                  <button 
                    class="pokemon-card" 
                    on:click={() => goToPokemonDetail(pokemon.pokedexNumber)}
                    type="button"
                  >
                    <div class="pokemon-card-image">
                      <img src={pokemon.spriteUrl} alt={pokemon.name} />
                    </div>
                    <div class="pokemon-card-info">
                      <p class="pokemon-name">{pokemon.name}</p>
                      <p class="pokemon-number">#{pokemon.pokedexNumber}</p>
                    </div>
                  </button>
                {/each}
              </div>
            {:else}
              <p class="no-pokemons">No hay pokémon que aprendan este movimiento.</p>
            {/if}
          </div>
        {/if}
      </section>
    </div>
  </div>
{/if}

<style>
  .move-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    margin-bottom: 2rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .back-link:hover {
    color: #2563eb;
    background-color: rgba(59, 130, 246, 0.1);
  }

  :global(.dark) .back-link {
    color: #60a5fa;
  }

  :global(.dark) .back-link:hover {
    color: #93c5fd;
    background-color: rgba(96, 165, 250, 0.1);
  }

  .move-header {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 3rem;
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .move-header {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .move-header-info {
    flex: 1;
  }

  .move-header-info h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 2rem 0;
    color: #1f2937;
    text-transform: capitalize;
  }

  :global(.dark) .move-header-info h1 {
    color: #f0f9ff;
  }

  .move-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-item .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.dark) .detail-item .label {
    color: #9ca3af;
  }

  .detail-item .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    text-transform: capitalize;
  }

  :global(.dark) .detail-item .value {
    color: #f0f9ff;
  }

  .move-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .section {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .expander-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .expander-header:hover {
    opacity: 0.8;
  }

  .expander-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-size: 1.2rem;
    color: #3b82f6;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  :global(.dark) .expander-icon {
    color: #60a5fa;
  }

  .expander-icon.expanded {
    transform: rotate(180deg);
  }

  .expander-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    flex: 1;
  }

  :global(.dark) .expander-title {
    color: #f0f9ff;
  }

  .expander-status {
    font-size: 0.85rem;
    color: #9ca3af;
    font-weight: 500;
  }

  :global(.dark) .expander-status {
    color: #6b7280;
  }

  .expander-content {
    margin-top: 1.5rem;
    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #9ca3af;
    font-style: italic;
  }

  :global(.dark) .loading-state {
    color: #6b7280;
  }

  .pokemons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }

  .pokemon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    font-family: inherit;
    font-size: inherit;
  }

  :global(.dark) .pokemon-card {
    background: #1e293b;
    border-color: #334155;
  }

  .pokemon-card:hover {
    background: #f3f4f6;
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-4px);
  }

  :global(.dark) .pokemon-card:hover {
    background: #0f172a;
    border-color: #60a5fa;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }

  .pokemon-card-image {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pokemon-card-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .pokemon-card-info {
    width: 100%;
  }

  .pokemon-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #1f2937;
    text-transform: capitalize;
  }

  :global(.dark) .pokemon-name {
    color: #f0f9ff;
  }

  .pokemon-number {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 500;
  }

  :global(.dark) .pokemon-number {
    color: #6b7280;
  }

  .no-pokemons {
    color: #9ca3af;
    font-style: italic;
    text-align: center;
    padding: 2rem 1rem;
    background-color: #f9fafb;
    border-radius: 12px;
    border: 1px dashed #e5e7eb;
  }

  :global(.dark) .no-pokemons {
    background-color: #1e293b;
    border-color: #334155;
    color: #6b7280;
  }
</style>
