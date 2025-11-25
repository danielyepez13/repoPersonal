<script lang="ts">
  // @ts-ignore
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { beforeNavigate, afterNavigate } from "$app/navigation";

  export let data: PageData;

  let isLoading = false;
  let showSettingsModal = false;
  let selectedLimit = 0;

  $: currentPage = data.pagination.page;
  $: currentLimit = data.pagination.limit;
  $: hasMore = data.pagination.hasMore;
  $: isFirstPage = currentPage === 1;
  $: pokemonsToShow = data.pokemons;
  $: selectedLimit = currentLimit;
  $: totalPages = calculateTotalPages(currentPage, hasMore);
  $: pageNumbers = calculatePageNumbers(currentPage, totalPages);

  function calculateTotalPages(current: number, hasMore: boolean): number {
    // Si hay más páginas, asumimos que hay al menos current + 1
    // Esto es una estimación basada en hasMore
    if (hasMore) {
      return Math.max(current + 10, current + 1); // Estimación conservadora
    }
    return current;
  }

  function calculatePageNumbers(
    current: number,
    total: number
  ): (number | string)[] {
    const delta = 2; // Mostrar 2 números antes y después
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);

    const pages: (number | string)[] = [];

    // Agregar página 1
    if (left > 1) pages.push(1);

    // Agregar "..." si hay gap
    if (left > 2) pages.push("...");

    // Agregar números del rango
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Agregar "..." si hay gap
    if (right < total - 1) pages.push("...");

    // Agregar última página
    if (right < total) pages.push(total);

    return pages;
  }

  beforeNavigate(({ to }) => {
    // Solo mostrar skeleton si la navegación es a una página diferente
    if (to?.url.searchParams.get("page") !== String(currentPage)) {
      isLoading = true;
    }
  });

  afterNavigate(() => {
    isLoading = false;
  });

  onMount(() => {
    isLoading = false;
  });

  function openSettingsModal() {
    showSettingsModal = true;
  }

  function closeSettingsModal() {
    showSettingsModal = false;
  }

  function applyLimitChange(newLimit: number) {
    const url = `/?page=1&limit=${newLimit}`;
    window.location.href = url;
  }
</script>

<div class="pokedex-container">
  <div class="header-section">
    <h1>Pokédex</h1>
    <p class="subtitle">Explora el mundo de los Pokémon</p>
  </div>

  <!-- Paginación Superior - Tipo Tabla -->
  <nav class="pagination-table" aria-label="Paginación">
    <div class="pagination-content">
      <!-- Botón Anterior -->
      {#if currentPage > 1}
        <a
          href="/?page={currentPage - 1}&limit={currentLimit}"
          class="btn-pagination"
          data-sveltekit-noscroll
          title="Página anterior"
          aria-label="Página anterior"
        >
          ◀ Anterior
        </a>
      {:else}
        <button class="btn-pagination" disabled title="No hay página anterior">
          ◀ Anterior
        </button>
      {/if}

      <!-- Números de página dinámicos -->
      <div class="page-numbers">
        {#each pageNumbers as pageNum}
          {#if pageNum === "..."}
            <span class="ellipsis">...</span>
          {:else}
            <a
              href="/?page={pageNum}&limit={currentLimit}"
              class="page-number"
              class:active={pageNum === currentPage}
              data-sveltekit-noscroll
              title="Ir a página {pageNum}"
              aria-label="Ir a página {pageNum}"
            >
              {pageNum}
            </a>
          {/if}
        {/each}
      </div>

      <!-- Botón Siguiente -->
      {#if hasMore}
        <a
          href="/?page={currentPage + 1}&limit={currentLimit}"
          class="btn-pagination"
          data-sveltekit-noscroll
          title="Página siguiente"
          aria-label="Página siguiente"
        >
          Siguiente ▶
        </a>
      {:else}
        <button class="btn-pagination" disabled title="No hay más páginas">
          Siguiente ▶
        </button>
      {/if}
    </div>
  </nav>

  <!-- Botón Tuerca - Posición Absoluta Lateral -->
  <button
    class="btn-settings-fixed"
    on:click={openSettingsModal}
    title="Configuración"
    aria-label="Abrir configuración"
  >
    ⚙️
  </button>

  <!-- Modal Lateral - Overlay -->
  {#if showSettingsModal}
    <div class="modal-overlay" on:click={closeSettingsModal}></div>

    <!-- Modal Lateral - Contenido -->
    <div class="settings-modal">
      <div class="modal-header">
        <h3>Configuración</h3>
        <button
          class="modal-close"
          on:click={closeSettingsModal}
          title="Cerrar"
          aria-label="Cerrar configuración"
        >
          ✕
        </button>
      </div>

      <div class="modal-content">
        <label class="settings-label">Items por página:</label>
        <div class="radio-group">
          <label class="radio-option">
            <input
              type="radio"
              value={10}
              bind:group={selectedLimit}
              name="limit"
            />
            <span>10 items</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              value={20}
              bind:group={selectedLimit}
              name="limit"
            />
            <span>20 items</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              value={50}
              bind:group={selectedLimit}
              name="limit"
            />
            <span>50 items</span>
          </label>
          <label class="radio-option">
            <input
              type="radio"
              value={100}
              bind:group={selectedLimit}
              name="limit"
            />
            <span>100 items</span>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn-modal btn-apply"
          on:click={() => applyLimitChange(selectedLimit)}
          title="Aplicar cambios"
        >
          Aplicar
        </button>
        <button
          class="btn-modal btn-cancel"
          on:click={closeSettingsModal}
          title="Cerrar sin cambios"
        >
          Cerrar
        </button>
      </div>
    </div>
  {/if}

  {#if isLoading}
    <div class="skeleton-grid">
      {#each Array(10) as _}
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-title"></div>
            <div class="skeleton-line skeleton-text"></div>
            <div class="skeleton-line skeleton-text"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="pokemon-grid-featured">
      {#each pokemonsToShow as pokemon (pokemon.pokedexNumber)}
        <a
          href="/pokemon/{pokemon.pokedexNumber}?page={currentPage}&limit={currentLimit}"
          class="pokemon-card skeleton-card"
          data-primary-type={pokemon.types[0]?.name || "normal"}
          data-secondary-type={pokemon.types[1]?.name || ""}
          class:dual-type={pokemon.types.length > 1}
        >
          {#if true}
            <div class="pokemon-card-featured">
              <div class="pokemon-image-featured">
                <img
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  loading="lazy"
                />
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
                        <div class="ability-tooltip-container">
                          <span
                            class="ability-badge"
                            class:hidden-ability={ability.isHidden}
                          >
                            <span class="ability-name">{ability.name}</span>
                            {#if ability.isHidden}
                              <span class="hidden-indicator">✦</span>
                            {/if}
                          </span>
                          {#if ability.description}
                            <div class="ability-tooltip">
                              <p class="tooltip-description">
                                {ability.description}
                              </p>
                            </div>
                          {/if}
                        </div>
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
  {/if}

  <!-- Paginación Inferior - Tipo Tabla (Igual a Superior) -->
  <nav class="pagination-table" aria-label="Paginación inferior">
    <div class="pagination-content">
      <!-- Botón Anterior -->
      {#if currentPage > 1}
        <a
          href="/?page={currentPage - 1}&limit={currentLimit}"
          class="btn-pagination"
          data-sveltekit-noscroll
          title="Página anterior"
          aria-label="Página anterior"
        >
          ◀ Anterior
        </a>
      {:else}
        <button class="btn-pagination" disabled title="No hay página anterior">
          ◀ Anterior
        </button>
      {/if}

      <!-- Números de página dinámicos -->
      <div class="page-numbers">
        {#each pageNumbers as pageNum}
          {#if pageNum === "..."}
            <span class="ellipsis">...</span>
          {:else}
            <a
              href="/?page={pageNum}&limit={currentLimit}"
              class="page-number"
              class:active={pageNum === currentPage}
              data-sveltekit-noscroll
              title="Ir a página {pageNum}"
              aria-label="Ir a página {pageNum}"
            >
              {pageNum}
            </a>
          {/if}
        {/each}
      </div>

      <!-- Botón Siguiente -->
      {#if hasMore}
        <a
          href="/?page={currentPage + 1}&limit={currentLimit}"
          class="btn-pagination"
          data-sveltekit-noscroll
          title="Página siguiente"
          aria-label="Página siguiente"
        >
          Siguiente ▶
        </a>
      {:else}
        <button class="btn-pagination" disabled title="No hay más páginas">
          Siguiente ▶
        </button>
      {/if}
    </div>
  </nav>
</div>

<style>
  .pokedex-container {
    /* max-width: 1200px; */
    margin: 0 auto;
    padding: 2rem;
  }

  /* Paginación Tipo Tabla */
  .pagination-table {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  :global(.dark) .pagination-table {
    background: #1e293b;
    border-color: #475569;
  }

  .pagination-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-numbers {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .page-number {
    min-width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    text-decoration: none;
    color: #1f2937;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  :global(.dark) .page-number {
    border-color: #475569;
    color: #f0f9ff;
  }

  .page-number:hover {
    background: #f3f4f6;
    border-color: #3b82f6;
  }

  :global(.dark) .page-number:hover {
    background: #0f172a;
    border-color: #3b82f6;
  }

  .page-number.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .ellipsis {
    padding: 0 0.25rem;
    color: #6b7280;
    font-weight: 600;
  }

  :global(.dark) .ellipsis {
    color: #9ca3af;
  }

  .btn-pagination {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    text-decoration: none;
    display: inline-block;
  }

  .btn-pagination:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Botón Tuerca - Posición Absoluta Lateral */
  .btn-settings-fixed {
    position: fixed;
    right: 2rem;
    bottom: 50%;
    transform: translateY(50%);
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    z-index: 500;
  }

  .btn-settings-fixed:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  .btn-settings-fixed:active {
    transform: translateY(50%) scale(0.95);
  }

  :global(.dark) .btn-settings-fixed {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  @media (max-width: 768px) {
    .btn-settings-fixed {
      right: 1rem;
      width: 44px;
      height: 44px;
      font-size: 1.2rem;
    }
  }

  /* Modal Lateral */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .settings-modal {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    background: white;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    animation: slideInRight 0.3s ease;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  :global(.dark) .settings-modal {
    background: #1e293b;
    box-shadow: -4px 0 16px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :global(.dark) .modal-header {
    border-bottom-color: #475569;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }

  :global(.dark) .modal-header h3 {
    color: #f0f9ff;
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    color: #6b7280;
    transition: all 0.2s ease;
    border-radius: 6px;
  }

  .modal-close:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  :global(.dark) .modal-close:hover {
    background: #0f172a;
    color: #f0f9ff;
  }

  .modal-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .settings-label {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  :global(.dark) .settings-label {
    color: #f0f9ff;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.75rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .radio-option:hover {
    background: #f3f4f6;
  }

  :global(.dark) .radio-option:hover {
    background: #0f172a;
  }

  .radio-option input[type="radio"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }

  .radio-option span {
    font-size: 0.95rem;
    color: #1f2937;
    font-weight: 500;
  }

  :global(.dark) .radio-option span {
    color: #f0f9ff;
  }

  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 0.75rem;
  }

  :global(.dark) .modal-footer {
    border-top-color: #475569;
  }

  .btn-modal {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-apply {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  }

  .btn-apply:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .btn-cancel {
    background: #e5e7eb;
    color: #1f2937;
  }

  .btn-cancel:hover {
    background: #d1d5db;
  }

  :global(.dark) .btn-cancel {
    background: #475569;
    color: #f0f9ff;
  }

  :global(.dark) .btn-cancel:hover {
    background: #64748b;
  }

  @media (max-width: 480px) {
    .settings-modal {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .pagination-table {
      padding: 1rem;
    }

    .pagination-content {
      gap: 0.25rem;
    }

    .page-number {
      min-width: 32px;
      height: 32px;
      font-size: 0.85rem;
    }

    .btn-pagination {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }

    .btn-settings {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
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
    overflow: visible;
    flex-direction: column;
    align-items: stretch;
    position: relative;
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
    overflow: visible;
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
    overflow: visible;
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
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }

  :global(.dark) .pagination {
    border-top-color: #334155;
  }

  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .page-info-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-direction: column;
    min-width: 150px;
    text-align: center;
  }

  @media (max-width: 600px) {
    .page-info-container {
      flex-direction: row;
      gap: 0.25rem;
    }
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

  .btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  .page-info {
    font-weight: 700;
    color: #1f2937;
    font-size: 1rem;
  }

  :global(.dark) .page-info {
    color: #f0f9ff;
  }

  .page-number {
    font-size: 1.2rem;
    font-weight: 800;
    color: #3b82f6;
  }

  :global(.dark) .page-number {
    color: #60a5fa;
  }

  /* Skeleton Loaders */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 2rem;
    margin-top: 3rem;
    margin-bottom: 3rem;
  }

  @media (max-width: 1600px) {
    .skeleton-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.8rem;
    }
  }

  @media (max-width: 1200px) {
    .skeleton-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.6rem;
    }
  }

  @media (max-width: 900px) {
    .skeleton-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.4rem;
    }
  }

  @media (max-width: 600px) {
    .skeleton-grid {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }
  }

  .skeleton-card {
    display: flex;
    flex-direction: column;
    padding: 0;
    border: 3px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
    background: white;
  }

  :global(.dark) .skeleton-card {
    border-color: #475569;
    background: #1e293b;
  }

  .skeleton-image {
    width: 100%;
    height: 140px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  :global(.dark) .skeleton-image {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }

  .skeleton-content {
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
  }

  .skeleton-line {
    height: 12px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  :global(.dark) .skeleton-line {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }

  .skeleton-title {
    height: 16px;
    width: 70%;
  }

  .skeleton-text {
    height: 10px;
    width: 100%;
  }

  .skeleton-text:last-child {
    width: 85%;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
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
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
    pointer-events: none;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid #334155;
  }

  .ability-tooltip::after {
    content: "";
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
