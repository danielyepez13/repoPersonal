<script lang="ts">
  export let winner: 'left' | 'right' | 'tie' = 'tie';
</script>

<div class="comparison-container">
  {#if winner === 'left'}
    <svg class="arrow-svg winner-left" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Flecha izquierda ganadora -->
      <defs>
        <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="20,50 60,30 60,70" fill="url(#leftGradient)" />
      <circle cx="75" cy="50" r="8" fill="url(#leftGradient)" />
    </svg>
  {:else if winner === 'right'}
    <svg class="arrow-svg winner-right" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Flecha derecha ganadora -->
      <defs>
        <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="80,50 40,30 40,70" fill="url(#rightGradient)" />
      <circle cx="25" cy="50" r="8" fill="url(#rightGradient)" />
    </svg>
  {:else}
    <svg class="arrow-svg tie" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Flechas bidireccionales (empate) -->
      <defs>
        <linearGradient id="tieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#9ca3af;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#6b7280;stop-opacity:1" />
        </linearGradient>
      </defs>
      <!-- Flecha izquierda -->
      <polygon points="15,50 35,40 35,60" fill="url(#tieGradient)" />
      <!-- Flecha derecha -->
      <polygon points="85,50 65,40 65,60" fill="url(#tieGradient)" />
      <!-- Línea central -->
      <line x1="40" y1="50" x2="60" y2="50" stroke="url(#tieGradient)" stroke-width="2" />
    </svg>
  {/if}
</div>

<style>
  .comparison-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 60px;
  }

  .arrow-svg {
    width: 60px;
    height: 60px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: all 0.3s ease;
  }

  .arrow-svg.winner-left,
  .arrow-svg.winner-right {
    animation: pulse 1.5s ease-in-out infinite;
  }

  .arrow-svg.tie {
    opacity: 0.6;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    50% {
      transform: scale(1.1);
      filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
    }
  }

  :global(.dark) .arrow-svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  :global(.dark) .arrow-svg.winner-left,
  :global(.dark) .arrow-svg.winner-right {
    filter: drop-shadow(0 4px 8px rgba(96, 165, 250, 0.3));
  }
</style>
