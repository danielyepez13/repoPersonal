<script lang="ts">
  let pokemonId = '';

  function goToPokemon() {
    if (pokemonId) {
      window.location.href = `/pokemon/${pokemonId}`;
    }
  }
</script>

<div class="container">
  <h1>Pokédex Hexagonal</h1>
  <p>Plataforma modular con arquitectura hexagonal CQRS</p>
  
  <form on:submit|preventDefault={goToPokemon}>
    <label for="pokemonId">
      Ingresa el ID del Pokémon:
      <input 
        id="pokemonId" 
        type="number" 
        bind:value={pokemonId} 
        min="1" 
        placeholder="Ej: 25 (Pikachu)"
        required
      />
    </label>
    <button type="submit">Buscar</button>
  </form>

  <div class="examples">
    <h2>Ejemplos:</h2>
    <ul>
      <li><a href="/pokemon/25">Pikachu (#25)</a></li>
      <li><a href="/pokemon/132">Ditto (#132)</a></li>
      <li><a href="/pokemon/1">Bulbasaur (#1)</a></li>
    </ul>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>