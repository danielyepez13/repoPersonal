<script lang="ts">
  // @ts-ignore
  import type { PageData } from "./$types";
  import { goto } from '$app/navigation';

  export let data: PageData;

  let moves: any[] = [];
  let movesLoading = false;
  let movesLoaded = false;
  let isMovesExpanded = false;

  async function toggleMovesExpander() {
    isMovesExpanded = !isMovesExpanded;
    
    // Si se abre y no hay datos cargados, cargar
    if (isMovesExpanded && !movesLoaded && !movesLoading) {
      await loadMoves();
    }
  }

  async function loadMoves() {
    if (movesLoaded || movesLoading) return;
    
    movesLoading = true;
    try {
      const response = await fetch(`/pokemon/${data.pokemon.pokedexNumber}/moves`);
      if (response.ok) {
        const result = await response.json();
        moves = result.moves || [];
        movesLoaded = true;
      }
    } catch (error) {
      console.error('Error loading moves:', error);
    } finally {
      movesLoading = false;
    }
  }

  function goToMoveDetail(moveId: number) {
    goto(`/pokemon/${data.pokemon.pokedexNumber}/moves/${moveId}`);
  }
</script>

{#if data?.pokemon}
  <div class="pokemon-detail-container">
    <a href="/" class="back-link">← Volver al listado</a>
    
    <div class="pokemon-header">
      <div class="pokemon-image">
        <img src={data?.pokemon?.spriteUrl} alt={data?.pokemon?.name} />
      </div>
      
      <div class="pokemon-header-info">
        <h1>{data?.pokemon?.name}</h1>
        <p class="pokedex-number">#{data?.pokemon?.pokedexNumber}</p>
        
        <div class="basic-info">
          <div class="info-item">
            <span class="label">Altura:</span>
            <span class="value">{data?.pokemon?.height} dm</span>
          </div>
          <div class="info-item">
            <span class="label">Peso:</span>
            <span class="value">{data?.pokemon?.weight} hg</span>
          </div>
        </div>

        <div class="types">
          {#each data?.pokemon?.types || [] as type}
            <span class="type-badge" data-type={type}>
              {type}
            </span>
          {/each}
        </div>
      </div>
    </div>

    <div class="pokemon-sections">
      <section class="section">
        <h2>Habilidades</h2>
        <div class="abilities-list">
          {#each data?.pokemon?.abilities || [] as ability}
            <div class="ability-item">
              <span class="ability-name">{ability.name}</span>
              {#if ability.isHidden}
                <span class="hidden-badge">Oculta</span>
              {/if}
            </div>
          {/each}
        </div>
      </section>

      <section class="section">
        <h2>Estadísticas</h2>
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-name">HP</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.hp || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.hp || 0}</span>
          </div>
          <div class="stat">
            <span class="stat-name">Ataque</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.attack || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.attack || 0}</span>
          </div>
          <div class="stat">
            <span class="stat-name">Defensa</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.defense || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.defense || 0}</span>
          </div>
          <div class="stat">
            <span class="stat-name">Ataque Especial</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.specialAttack || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.specialAttack || 0}</span>
          </div>
          <div class="stat">
            <span class="stat-name">Defensa Especial</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.specialDefense || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.specialDefense || 0}</span>
          </div>
          <div class="stat">
            <span class="stat-name">Velocidad</span>
            <div class="stat-bar">
              <div class="stat-fill" style="width: {(data?.pokemon?.stats?.speed || 0) / 1.5}%"></div>
            </div>
            <span class="stat-value">{data?.pokemon?.stats?.speed || 0}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <button class="expander-header" on:click={toggleMovesExpander}>
          <span class="expander-icon" class:expanded={isMovesExpanded}>▾</span>
          <h2 class="expander-title">
            Movimientos {moves.length > 0 ? `(${moves.length})` : ''}
          </h2>
          {#if movesLoading}
            <span class="expander-status">Cargando...</span>
          {/if}
        </button>
        
        {#if isMovesExpanded}
          <div class="expander-content">
            {#if movesLoading}
              <div class="loading-state">
                <p>Cargando movimientos...</p>
              </div>
            {:else if moves && moves.length > 0}
              <div class="moves-table">
                <div class="moves-header">
                  <div class="move-col-name">Nombre</div>
                  <div class="move-col-type">Tipo</div>
                  <div class="move-col-power">Poder</div>
                  <div class="move-col-pp">PP</div>
                  <div class="move-col-accuracy">Precisión</div>
                </div>
                {#each moves as move}
                  <button 
                    class="move-row" 
                    on:click={() => goToMoveDetail(move.pokeApiId)}
                    type="button"
                  >
                    <div class="move-col-name">{move.name}</div>
                    <div class="move-col-type">
                      <span class="type-badge" data-type={move.type?.name || 'normal'}>
                        {move.type?.name || 'normal'}
                      </span>
                    </div>
                    <div class="move-col-power">{move.power || '-'}</div>
                    <div class="move-col-pp">{move.pp || '-'}</div>
                    <div class="move-col-accuracy">{move.accuracy || '-'}</div>
                  </button>
                {/each}
              </div>
            {:else}
              <p class="no-moves">Este Pokémon no tiene movimientos registrados.</p>
            {/if}
          </div>
        {/if}
      </section>
    </div>
  </div>
{/if}

<style>
  .pokemon-detail-container {
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

  .pokemon-header {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 3rem;
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .pokemon-header {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .pokemon-image {
    flex-shrink: 0;
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-radius: 16px;
  }

  :global(.dark) .pokemon-image {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  .pokemon-image img {
    width: 200px;
    height: 200px;
    object-fit: contain;
  }

  .pokemon-header-info {
    flex: 1;
  }

  .pokemon-header-info h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.8rem;
    text-transform: capitalize;
    color: #1f2937;
    font-weight: 800;
  }

  :global(.dark) .pokemon-header-info h1 {
    color: #f0f9ff;
  }

  .pokedex-number {
    color: #9ca3af;
    font-size: 1.1rem;
    margin: 0 0 1.5rem 0;
    font-weight: 500;
  }

  :global(.dark) .pokedex-number {
    color: #6b7280;
  }

  .basic-info {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .info-item .label {
    color: #9ca3af;
    font-size: 0.9rem;
    margin-bottom: 0.35rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global(.dark) .info-item .label {
    color: #6b7280;
  }

  .info-item .value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1f2937;
  }

  :global(.dark) .info-item .value {
    color: #f0f9ff;
  }

  .types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .type-badge {
    display: inline-block;
    padding: 0.5rem 1.1rem;
    border-radius: 20px;
    font-size: 0.9rem;
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

  .pokemon-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .section {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .section h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 700;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 0.75rem;
  }

  :global(.dark) .section h2 {
    color: #f0f9ff;
    border-bottom-color: #60a5fa;
  }

  .abilities-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.2rem;
  }

  .ability-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  :global(.dark) .ability-item {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-color: #334155;
  }

  .ability-item:hover {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border-color: #d1d5db;
    transform: translateY(-2px);
  }

  :global(.dark) .ability-item:hover {
    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
    border-color: #475569;
  }

  .ability-name {
    text-transform: capitalize;
    font-weight: 600;
    color: #1f2937;
    flex: 1;
  }

  :global(.dark) .ability-name {
    color: #f0f9ff;
  }

  .hidden-badge {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 0.35rem 0.65rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .stat-name {
    font-weight: 700;
    color: #1f2937;
    font-size: 0.95rem;
    text-transform: capitalize;
  }

  :global(.dark) .stat-name {
    color: #f0f9ff;
  }

  .stat-bar {
    height: 10px;
    background-color: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  :global(.dark) .stat-bar {
    background-color: #334155;
  }

  .stat-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    transition: width 0.3s ease;
  }

  .stat-value {
    font-weight: 700;
    color: #3b82f6;
    font-size: 1rem;
  }

  :global(.dark) .stat-value {
    color: #60a5fa;
  }

  .moves-table {
    overflow-x: auto;
  }

  .moves-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 1.2rem;
    padding: 1.2rem;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 12px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  :global(.dark) .moves-header {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    color: #f0f9ff;
    border-color: #334155;
  }

  .move-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 1.2rem;
    padding: 1.2rem;
    border-bottom: 1px solid #e5e7eb;
    align-items: center;
    transition: all 0.2s ease;
    background: none;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: inherit;
  }

  :global(.dark) .move-row {
    border-bottom-color: #334155;
  }

  .move-row:hover {
    background-color: #f3f4f6;
    transform: translateX(4px);
  }

  :global(.dark) .move-row:hover {
    background-color: #1e293b;
  }

  .move-row:active {
    transform: translateX(2px);
  }

  .move-row:last-child {
    border-bottom: none;
  }

  .move-col-name {
    text-transform: capitalize;
    font-weight: 600;
    color: #1f2937;
  }

  :global(.dark) .move-col-name {
    color: #f0f9ff;
  }

  .move-col-type,
  .move-col-power,
  .move-col-pp,
  .move-col-accuracy {
    text-align: center;
    color: #6b7280;
    font-weight: 500;
  }

  :global(.dark) .move-col-type,
  :global(.dark) .move-col-power,
  :global(.dark) .move-col-pp,
  :global(.dark) .move-col-accuracy {
    color: #9ca3af;
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

  .no-moves {
    color: #9ca3af;
    font-style: italic;
    text-align: center;
    padding: 2rem 1rem;
    background-color: #f9fafb;
    border-radius: 12px;
    border: 1px dashed #e5e7eb;
  }

  :global(.dark) .no-moves {
    background-color: #1e293b;
    color: #6b7280;
    border-color: #334155;
  }
</style>
