<script lang="ts">
  // @ts-ignore
  import type { PageData } from "./$types";

  export let data: PageData;

  $: currentPage = data.pagination.page;
  $: hasMore = data.pagination.hasMore;
  $: isFirstPage = currentPage === 1;
  $: pokemonsToShow = data.pokemons;
</script>

<div class="pokedex-container">
  <div class="header-section">
    <h1>Pokédex</h1>
    <p class="subtitle">Explora el mundo de los Pokémon</p>
  </div>

  <div class="pokemon-grid-featured">
    {#each pokemonsToShow as pokemon (pokemon.pokedexNumber)}
      <a
        href="/pokemon/{pokemon.pokedexNumber}"
        class="pokemon-card skeleton-card"
        data-primary-type={pokemon.types[0]?.name || "normal"}
        data-secondary-type={pokemon.types[1]?.name || ""}
        class:dual-type={pokemon.types.length > 1}
      >
        {#if true}
          <div class="pokemon-card-featured">
            <div class="pokemon-image-featured">
              <img src={pokemon.spriteUrl} alt={pokemon.name} loading="lazy" />
            </div>
            <div class="pokemon-info-featured">
              <div class="pokemon-header-featured">
                <h3>{pokemon.name}</h3>
                <p class="pokedex-number">#{pokemon.pokedexNumber}</p>
              </div>
              <div class="types-featured">
                {#each pokemon.types as type}
                  <span class="type-badge" data-type={type.name}>
                    {type.name}
                  </span>
                {/each}
              </div>
              {#if pokemon.abilities && pokemon.abilities.length > 0}
                <div class="abilities-featured">
                  <span class="abilities-label">Habilidades:</span>
                  <div class="abilities-list-featured">
                    {#each pokemon.abilities as ability}
                      <span class="ability-badge" class:hidden-ability={ability.isHidden} title={ability.isHidden ? 'Habilidad Oculta' : 'Habilidad Normal'}>
                        <span class="ability-name">{ability.name}</span>
                        {#if ability.isHidden}
                          <span class="hidden-indicator" title="Habilidad Oculta">✦</span>
                        {/if}
                      </span>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </a>
    {/each}
  </div>

  <div class="pagination">
    {#if currentPage > 1}
      <a
        href="/?page={currentPage - 1}&limit={data.pagination.limit}"
        class="btn btn-primary"
      >
        ← Anterior
      </a>
    {/if}

    <span class="page-info">Página {currentPage}</span>

    {#if hasMore}
      <a
        href="/?page={currentPage + 1}&limit={data.pagination.limit}"
        class="btn btn-primary"
      >
        Siguiente →
      </a>
    {/if}
  </div>
</div>

<style>
  .pokedex-container {
    /* max-width: 1200px; */
    margin: 0 auto;
    padding: 2rem;
  }

  .header-section {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-size: 2.5rem;
    font-weight: 800;
  }

  :global(.dark) h1 {
    color: #f0f9ff;
  }

  .subtitle {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }

  :global(.dark) .subtitle {
    color: #cbd5e1;
  }

  .pokemon-grid-featured {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 1600px) {
    .pokemon-grid-featured {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.8rem;
    }
  }

  @media (max-width: 1200px) {
    .pokemon-grid-featured {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.6rem;
    }
  }

  @media (max-width: 900px) {
    .pokemon-grid-featured {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.4rem;
    }
  }

  @media (max-width: 600px) {
    .pokemon-grid-featured {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }
  }

  .pokemon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  :global(.dark) .pokemon-card {
    background: #1e293b;
    border-color: #475569;
  }

  :global(.dark) .pokemon-grid-featured .pokemon-card {
    background: #0f172a;
  }

  :global(.dark) .pokemon-info-featured {
    background: #0f172a;
  }

  :global(.dark) .pokemon-image-featured {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  .pokemon-card:hover {
    transform: translateY(-12px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
    border-color: #3b82f6;
  }

  .pokemon-grid-featured .pokemon-card {
    padding: 0;
    border: 3px solid;
    border-radius: 16px !important;
    overflow: hidden;
    flex-direction: column;
    align-items: stretch;
  }

  .pokemon-grid-featured .pokemon-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  }

  .pokemon-card-featured {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 16px;
  }

  .pokemon-image-featured {
    width: 100%;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    padding: 1rem;
    border-radius: 13px 13px 0 0;
  }

  :global(.dark) .pokemon-image-featured {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }

  .pokemon-image-featured img {
    width: 120px;
    height: 120px;
    object-fit: contain;
  }

  .pokemon-info-featured {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.2rem;
    background: white;
    border-radius: 0 0 13px 13px;
    flex: 1;
  }

  :global(.dark) .pokemon-info-featured {
    background: #0f172a;
  }

  .pokemon-header-featured {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .pokemon-header-featured h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: capitalize;
    color: #1f2937;
    line-height: 1.2;
  }

  :global(.dark) .pokemon-header-featured h3 {
    color: #f0f9ff;
  }

  .pokemon-header-featured .pokedex-number {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
    font-weight: 600;
  }

  :global(.dark) .pokemon-header-featured .pokedex-number {
    color: #6b7280;
  }

  .types-featured {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .abilities-featured {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: auto;
  }

  .abilities-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  :global(.dark) .abilities-label {
    color: #9ca3af;
  }

  .abilities-list-featured {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .ability-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.65rem;
    background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
    color: #1e40af;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: capitalize;
    border: 1px solid #bfdbfe;
    transition: all 0.2s ease;
  }

  .ability-badge:hover {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    transform: scale(1.05);
  }

  .ability-badge.hidden-ability {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    border-color: #fcd34d;
  }

  .ability-badge.hidden-ability:hover {
    background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
  }

  :global(.dark) .ability-badge {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
    color: #bfdbfe;
    border-color: #3b82f6;
  }

  :global(.dark) .ability-badge:hover {
    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  }

  :global(.dark) .ability-badge.hidden-ability {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    color: #fef3c7;
    border-color: #d97706;
  }

  :global(.dark) .ability-badge.hidden-ability:hover {
    background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
  }

  .ability-name {
    display: inline;
  }

  .hidden-indicator {
    font-size: 0.8rem;
    font-weight: 900;
    opacity: 0.8;
  }

  .pokedex-number {
    color: #9ca3af;
    font-size: 0.85rem;
    margin: 0.25rem 0;
    font-weight: 500;
  }

  .type-badge {
    display: inline-block;
    padding: 0.35rem 0.7rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: capitalize;
    color: white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .pokemon-grid-featured .type-badge {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
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
    background: linear-gradient(135deg, #f8d030 0%, #d4a820 100%);
    color: #333;
  }
  .type-badge[data-type="grass"] {
    background: linear-gradient(135deg, #78c850 0%, #5aa838 100%);
  }
  .type-badge[data-type="ice"] {
    background: linear-gradient(135deg, #98d8d8 0%, #70b8b8 100%);
    color: #333;
  }
  .type-badge[data-type="fighting"] {
    background: linear-gradient(135deg, #c03028 0%, #a02018 100%);
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
    background: linear-gradient(135deg, #f85888 0%, #d83860 100%);
  }
  .type-badge[data-type="bug"] {
    background: linear-gradient(135deg, #a8b820 0%, #88a018 100%);
  }
  .type-badge[data-type="rock"] {
    background: linear-gradient(135deg, #b8a038 0%, #988028 100%);
  }
  .type-badge[data-type="ghost"] {
    background: linear-gradient(135deg, #705898 0%, #584080 100%);
  }
  .type-badge[data-type="dragon"] {
    background: linear-gradient(135deg, #7038f8 0%, #5820d8 100%);
  }
  .type-badge[data-type="dark"] {
    background: linear-gradient(135deg, #705848 0%, #584038 100%);
  }
  .type-badge[data-type="steel"] {
    background: linear-gradient(135deg, #b8b8d0 0%, #9898b0 100%);
    color: #333;
  }
  .type-badge[data-type="fairy"] {
    background: linear-gradient(135deg, #ee99ac 0%, #ce7a8c 100%);
  }

  /* Bordes de color según tipo primario en tarjetas destacadas */
  .pokemon-grid-featured .pokemon-card[data-primary-type="normal"] {
    border-color: #a8a878;
    box-shadow: 0 4px 12px rgba(168, 168, 120, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="fire"] {
    border-color: #f08030;
    box-shadow: 0 4px 12px rgba(240, 128, 48, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="water"] {
    border-color: #6890f0;
    box-shadow: 0 4px 12px rgba(104, 144, 240, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="electric"] {
    border-color: #f8d030;
    box-shadow: 0 4px 12px rgba(248, 208, 48, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="grass"] {
    border-color: #78c850;
    box-shadow: 0 4px 12px rgba(120, 200, 80, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="ice"] {
    border-color: #98d8d8;
    box-shadow: 0 4px 12px rgba(152, 216, 216, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="fighting"] {
    border-color: #c03028;
    box-shadow: 0 4px 12px rgba(192, 48, 40, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="poison"] {
    border-color: #a040a0;
    box-shadow: 0 4px 12px rgba(160, 64, 160, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="ground"] {
    border-color: #e0c068;
    box-shadow: 0 4px 12px rgba(224, 192, 104, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="flying"] {
    border-color: #a890f0;
    box-shadow: 0 4px 12px rgba(168, 144, 240, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="psychic"] {
    border-color: #f85888;
    box-shadow: 0 4px 12px rgba(248, 88, 136, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="bug"] {
    border-color: #a8b820;
    box-shadow: 0 4px 12px rgba(168, 184, 32, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="rock"] {
    border-color: #b8a038;
    box-shadow: 0 4px 12px rgba(184, 160, 56, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="ghost"] {
    border-color: #705898;
    box-shadow: 0 4px 12px rgba(112, 88, 152, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="dragon"] {
    border-color: #7038f8;
    box-shadow: 0 4px 12px rgba(112, 56, 248, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="dark"] {
    border-color: #705848;
    box-shadow: 0 4px 12px rgba(112, 88, 72, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="steel"] {
    border-color: #b8b8d0;
    box-shadow: 0 4px 12px rgba(184, 184, 208, 0.3);
  }
  .pokemon-grid-featured .pokemon-card[data-primary-type="fairy"] {
    border-color: #ee99ac;
    box-shadow: 0 4px 12px rgba(238, 153, 172, 0.3);
  }


  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  :global(.dark) .pagination {
    border-top-color: #334155;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  .page-info {
    font-weight: 700;
    color: #1f2937;
    font-size: 1rem;
  }
</style>
