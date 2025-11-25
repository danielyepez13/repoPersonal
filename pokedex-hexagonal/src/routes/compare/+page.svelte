<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import ComparisonArrows from '$lib/components/ComparisonArrows.svelte';
  import PokemonAutocomplete from '$lib/components/PokemonAutocomplete.svelte';

  export let data: PageData;

  let pokemon1Input = '';
  let pokemon2Input = '';
  let isSearching = false;

  async function handleCompare() {
    if (!pokemon1Input.trim() || !pokemon2Input.trim()) {
      alert('Por favor ingresa los nombres de ambos Pokémon');
      return;
    }

    isSearching = true;
    // Navegar sin esperar, el loader se encargará de cargar los datos
    await goto(`/compare?p1=${encodeURIComponent(pokemon1Input.trim())}&p2=${encodeURIComponent(pokemon2Input.trim())}`);
    isSearching = false;
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleCompare();
    }
  }

  function getStatValue(stats: any[], statName: string): number {
    const stat = stats?.find((s: any) => s.name === statName);
    return stat?.baseStat || 0;
  }

  function getWinnerStat(stats1: any[], stats2: any[], statName: string): 'left' | 'right' | 'tie' {
    const val1 = getStatValue(stats1, statName);
    const val2 = getStatValue(stats2, statName);
    if (val1 > val2) return 'left';
    if (val2 > val1) return 'right';
    return 'tie';
  }
</script>

<div class="compare-container">
  <a href="/" class="back-link">← Volver al listado</a>

  <div class="compare-header">
    <h1>Comparar Pokémon</h1>
    <p class="subtitle">Selecciona dos Pokémon para ver sus estadísticas lado a lado</p>
  </div>

  <div class="search-section">
    <div class="search-inputs">
      <div class="input-group">
        <PokemonAutocomplete
          id="pokemon1"
          label="Primer Pokémon"
          placeholder="Ej: Bulbasaur, Charmander..."
          bind:value={pokemon1Input}
        />
      </div>

      <div class="vs-separator">VS</div>

      <div class="input-group">
        <PokemonAutocomplete
          id="pokemon2"
          label="Segundo Pokémon"
          placeholder="Ej: Squirtle, Pikachu..."
          bind:value={pokemon2Input}
        />
      </div>
    </div>

    <button class="compare-btn" on:click={handleCompare} disabled={isSearching}>
      {#if isSearching}
        Cargando...
      {:else}
        Comparar
      {/if}
    </button>
  </div>

  {#if data.pokemon1 && data.pokemon2}
    <div class="battle-arena">
      <!-- Área de batalla con tarjetas -->
      <div class="battle-header">
        <!-- Tarjeta Pokémon 1 -->
        <div class="pokemon-card left">
          <div class="pokemon-card-image">
            <img src={data.pokemon1.spriteUrl} alt={data.pokemon1.name} class="battle-sprite" />
          </div>
          <div class="pokemon-card-info">
            <a href="/pokemon/{data.pokemon1.pokedexNumber}" class="pokemon-card-name-link">
              <h3 class="pokemon-card-name">{data.pokemon1.name}</h3>
            </a>
            <p class="pokemon-card-number">#{data.pokemon1.pokedexNumber}</p>
            
            <div class="pokemon-card-detail">
              <div class="detail-row">
                <span class="detail-label">Altura:</span>
                <span class="detail-value">{data.pokemon1.height} dm</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Peso:</span>
                <span class="detail-value">{data.pokemon1.weight} hg</span>
              </div>
            </div>

            <div class="pokemon-card-types">
              {#each data.pokemon1.types || [] as type}
                <span class="type-badge" data-type={type.name}>{type.name}</span>
              {/each}
            </div>

            {#if data.pokemon1.abilities && data.pokemon1.abilities.length > 0}
              <div class="pokemon-card-abilities">
                <span class="abilities-label">Habilidades:</span>
                <div class="abilities-list">
                  {#each data.pokemon1.abilities as ability}
                    <div class="ability-tooltip-container">
                      <span class="ability-badge" class:hidden-ability={ability.isHidden}>
                        <span class="ability-name">{ability.name}</span>
                        {#if ability.isHidden}
                          <span class="hidden-indicator">✦</span>
                        {/if}
                      </span>
                      {#if ability.description}
                        <div class="ability-tooltip">
                          <p class="tooltip-description">{ability.description}</p>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Centro con VS y flechas -->
        <div class="battle-center">
          <div class="battle-vs">
            <span class="vs-text">VS</span>
          </div>
        </div>

        <!-- Tarjeta Pokémon 2 -->
        <div class="pokemon-card right">
          <div class="pokemon-card-info">
            <a href="/pokemon/{data.pokemon2.pokedexNumber}" class="pokemon-card-name-link">
              <h3 class="pokemon-card-name">{data.pokemon2.name}</h3>
            </a>
            <p class="pokemon-card-number">#{data.pokemon2.pokedexNumber}</p>
            
            <div class="pokemon-card-detail">
              <div class="detail-row">
                <span class="detail-label">Altura:</span>
                <span class="detail-value">{data.pokemon2.height} dm</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Peso:</span>
                <span class="detail-value">{data.pokemon2.weight} hg</span>
              </div>
            </div>

            <div class="pokemon-card-types">
              {#each data.pokemon2.types || [] as type}
                <span class="type-badge" data-type={type.name}>{type.name}</span>
              {/each}
            </div>

            {#if data.pokemon2.abilities && data.pokemon2.abilities.length > 0}
              <div class="pokemon-card-abilities">
                <span class="abilities-label">Habilidades:</span>
                <div class="abilities-list">
                  {#each data.pokemon2.abilities as ability}
                    <div class="ability-tooltip-container">
                      <span class="ability-badge" class:hidden-ability={ability.isHidden}>
                        <span class="ability-name">{ability.name}</span>
                        {#if ability.isHidden}
                          <span class="hidden-indicator">✦</span>
                        {/if}
                      </span>
                      {#if ability.description}
                        <div class="ability-tooltip">
                          <p class="tooltip-description">{ability.description}</p>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
          <div class="pokemon-card-image">
            <img src={data.pokemon2.spriteUrl} alt={data.pokemon2.name} class="battle-sprite" />
          </div>
        </div>
      </div>

      <!-- Comparación de estadísticas -->
      <div class="stats-comparison">
        <h2>Comparación de Estadísticas</h2>
        
        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">HP</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'hp')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'hp')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'hp')}</div>
            <div class="stat-label">HP</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">Ataque</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'attack')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'attack')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'attack')}</div>
            <div class="stat-label">Ataque</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">Defensa</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'defense')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'defense')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'defense')}</div>
            <div class="stat-label">Defensa</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">Ataque Esp.</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'special-attack')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'special-attack')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'special-attack')}</div>
            <div class="stat-label">Ataque Esp.</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">Defensa Esp.</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'special-defense')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'special-defense')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'special-defense')}</div>
            <div class="stat-label">Defensa Esp.</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-card left">
            <div class="stat-label">Velocidad</div>
            <div class="stat-value">{getStatValue(data.pokemon1.stats, 'speed')}</div>
          </div>
          <div class="stat-comparison-bar">
            <ComparisonArrows winner={getWinnerStat(data.pokemon1.stats, data.pokemon2.stats, 'speed')} />
          </div>
          <div class="stat-card right">
            <div class="stat-value">{getStatValue(data.pokemon2.stats, 'speed')}</div>
            <div class="stat-label">Velocidad</div>
          </div>
        </div>
      </div>
    </div>
  {:else if data.error}
    <div class="error-message">
      <p>{data.error}</p>
    </div>
  {/if}
</div>

<style>
  .compare-container {
    max-width: 1400px;
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

  .compare-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .compare-header h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  :global(.dark) .compare-header h1 {
    color: #f0f9ff;
  }

  .subtitle {
    color: #9ca3af;
    font-size: 1.1rem;
    margin: 0;
  }

  :global(.dark) .subtitle {
    color: #6b7280;
  }

  .search-section {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 3rem;
  }

  :global(.dark) .search-section {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .search-inputs {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: flex-end;
    margin-bottom: 1.5rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }


  .vs-separator {
    font-weight: 700;
    color: #3b82f6;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  :global(.dark) .vs-separator {
    color: #60a5fa;
  }

  .compare-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  }

  .compare-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .compare-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Battle Arena */
  .battle-arena {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .battle-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    padding: 1rem 0;
  }

  .pokemon-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    min-width: 200px;
    overflow: visible;
  }

  :global(.dark) .pokemon-card {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .pokemon-card.left {
    flex-direction: column;
  }

  .pokemon-card.right {
    flex-direction: column-reverse;
  }

  .pokemon-card-image {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
  }

  .pokemon-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow: visible;
  }

  .pokemon-card-name {
    font-size: 1.3rem;
    font-weight: 800;
    text-transform: capitalize;
    color: #1f2937;
    margin: 0;
  }

  :global(.dark) .pokemon-card-name {
    color: #f0f9ff;
  }

  .pokemon-card-number {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
    font-weight: 600;
  }

  :global(.dark) .pokemon-card-number {
    color: #9ca3af;
  }

  .pokemon-card-name-link {
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .pokemon-card-name-link:hover .pokemon-card-name {
    color: #3b82f6;
  }

  :global(.dark) .pokemon-card-name-link:hover .pokemon-card-name {
    color: #60a5fa;
  }

  .pokemon-card-detail {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 8px;
  }

  :global(.dark) .pokemon-card-detail {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .detail-label {
    font-weight: 600;
    color: #6b7280;
  }

  :global(.dark) .detail-label {
    color: #9ca3af;
  }

  .detail-value {
    font-weight: 700;
    color: #1f2937;
  }

  :global(.dark) .detail-value {
    color: #f0f9ff;
  }

  .pokemon-card-types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .pokemon-card-abilities {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: visible;
  }

  .abilities-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.dark) .abilities-label {
    color: #9ca3af;
  }

  .abilities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    overflow: visible;
  }

  .ability-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #1f2937;
    text-transform: capitalize;
    transition: all 0.3s ease;
  }

  :global(.dark) .ability-badge {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: #f0f9ff;
  }

  .ability-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) .ability-badge:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .ability-badge.hidden-ability {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }

  :global(.dark) .ability-badge.hidden-ability {
    background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
    color: #fef3c7;
  }

  .ability-name {
    flex: 1;
  }

  .hidden-indicator {
    font-size: 0.9rem;
    font-weight: 800;
  }

  .battle-sprite {
    width: 150px;
    height: 150px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  }

  .battle-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .battle-vs {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    animation: pulse-vs 1.5s ease-in-out infinite;
  }

  :global(.dark) .battle-vs {
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
  }

  .vs-text {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  @keyframes pulse-vs {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    50% { 
      transform: scale(1.1);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
    }
  }

  /* Stats Comparison */
  .stats-comparison {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .stats-comparison {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .stats-comparison h2 {
    text-align: center;
    color: #1f2937;
    margin: 0 0 2rem 0;
    font-size: 1.8rem;
  }

  :global(.dark) .stats-comparison h2 {
    color: #f0f9ff;
  }

  .stat-row {
    display: grid;
    grid-template-columns: 120px 1fr 120px;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  :global(.dark) .stat-row {
    border-bottom-color: #334155;
  }

  .stat-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 12px;
    border: 2px solid #e5e7eb;
  }

  :global(.dark) .stat-card {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: #334155;
  }

  .stat-card.left {
    flex-direction: column;
  }

  .stat-card.right {
    flex-direction: column-reverse;
  }

  .stat-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.dark) .stat-label {
    color: #9ca3af;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: 800;
    color: #3b82f6;
  }

  :global(.dark) .stat-value {
    color: #60a5fa;
  }

  .stat-comparison-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60px;
  }


  /* Info Grid */
  @media (max-width: 768px) {

    .battle-header {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .pokemon-card {
      min-width: auto;
    }

    .stat-row {
      grid-template-columns: 100px 1fr 100px;
    }

    .search-inputs {
      grid-template-columns: 1fr;
    }

    .vs-separator {
      display: none;
    }

    .battle-sprite {
      width: 120px;
      height: 120px;
    }
  }


  .type-badge {
    display: inline-block;
    padding: 0.4rem 0.9rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .type-badge[data-type="normal"] { background: linear-gradient(135deg, #a8a878 0%, #8b8b5f 100%); }
  .type-badge[data-type="fire"] { background: linear-gradient(135deg, #f08030 0%, #d86820 100%); }
  .type-badge[data-type="water"] { background: linear-gradient(135deg, #6890f0 0%, #4a7fd0 100%); }
  .type-badge[data-type="electric"] { background: linear-gradient(135deg, #f8d030 0%, #d8b820 100%); color: #333; }
  .type-badge[data-type="grass"] { background: linear-gradient(135deg, #78c850 0%, #5ca838 100%); }
  .type-badge[data-type="ice"] { background: linear-gradient(135deg, #98d8d8 0%, #78b8b8 100%); color: #333; }
  .type-badge[data-type="fighting"] { background: linear-gradient(135deg, #c03028 0%, #a02018 100%); }
  .type-badge[data-type="poison"] { background: linear-gradient(135deg, #a040a0 0%, #803080 100%); }
  .type-badge[data-type="ground"] { background: linear-gradient(135deg, #e0c068 0%, #c0a850 100%); color: #333; }
  .type-badge[data-type="flying"] { background: linear-gradient(135deg, #a890f0 0%, #8870d0 100%); }
  .type-badge[data-type="psychic"] { background: linear-gradient(135deg, #f85888 0%, #d83860 100%); }
  .type-badge[data-type="bug"] { background: linear-gradient(135deg, #a8b820 0%, #88a018 100%); }
  .type-badge[data-type="rock"] { background: linear-gradient(135deg, #b8a038 0%, #988028 100%); }
  .type-badge[data-type="ghost"] { background: linear-gradient(135deg, #705898 0%, #584080 100%); }
  .type-badge[data-type="dragon"] { background: linear-gradient(135deg, #7038f8 0%, #5820d8 100%); }
  .type-badge[data-type="dark"] { background: linear-gradient(135deg, #705848 0%, #584038 100%); }
  .type-badge[data-type="steel"] { background: linear-gradient(135deg, #b8b8d0 0%, #9898b0 100%); color: #333; }
  .type-badge[data-type="fairy"] { background: linear-gradient(135deg, #ee99ac 0%, #ce7a8c 100%); }

  .error-message {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 12px;
    padding: 1.5rem;
    color: #991b1b;
    text-align: center;
    font-weight: 500;
  }

  :global(.dark) .error-message {
    background: #7f1d1d;
    border-color: #dc2626;
    color: #fecaca;
  }

  /* Tooltips para habilidades */
  .ability-tooltip-container {
    position: relative;
    display: inline-block;
  }

  .ability-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1f2937;
    color: #f0f9ff;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    white-space: normal;
    width: 200px;
    max-width: 200px;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    pointer-events: none;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid #334155;
  }

  .ability-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1f2937;
  }

  .ability-tooltip-container:hover .ability-tooltip {
    opacity: 1;
    visibility: visible;
  }

  .tooltip-description {
    margin: 0;
    line-height: 1.4;
    font-weight: 500;
  }

  :global(.dark) .ability-tooltip {
    background: #0f172a;
    color: #f0f9ff;
    border-color: #475569;
  }

  :global(.dark) .ability-tooltip::after {
    border-top-color: #0f172a;
  }
</style>
