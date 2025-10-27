<script lang="ts">
  // @ts-ignore
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#if data?.error}
  <h1>Error: {data?.error?.message} (Código: {data?.error?.code})</h1>
{:else if data?.pokemon}
  <div class="pokemon-detail">
    <h1>{data?.pokemon?.name}</h1>
    <p>ID: {data?.pokemon?.id}</p>
    <p>Altura: {data?.pokemon?.height} dm</p>
    <p>Peso: {data?.pokemon?.weight} hg</p>

    <h2>Tipos</h2>
    <ul>
      {#each data?.pokemon?.types || [] as type}
        <li>{type}</li>
      {/each}
    </ul>

    <h2>Habilidades</h2>
    <ul>
      {#each data?.pokemon?.abilities || [] as ability}
        <li>
          {ability.name}
          {#if ability.isHidden}
            (Oculta){/if}
        </li>
      {/each}
    </ul>

    <h2>Estadísticas</h2>
    <ul>
      <li>HP: {data?.pokemon?.stats?.hp || 0}</li>
      <li>Ataque: {data?.pokemon?.stats?.attack || 0}</li>
      <li>Defensa: {data?.pokemon?.stats?.defense || 0}</li>
      <li>Ataque Especial: {data?.pokemon?.stats?.specialAttack || 0}</li>
      <li>Defensa Especial: {data?.pokemon?.stats?.specialDefense || 0}</li>
      <li>Velocidad: {data?.pokemon?.stats?.speed || 0}</li>
    </ul>
  </div>
{/if}
