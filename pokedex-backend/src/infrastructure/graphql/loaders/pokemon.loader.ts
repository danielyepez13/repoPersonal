import { Injectable, Inject } from '@nestjs/common';
import type { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';

/**
 * Implementación nativa de DataLoader para Pokémon.
 * Agrupa y cachea queries durante la ejecución de un request GraphQL.
 * Soluciona el problema N+1 cuando se cargan Pokémon relacionados.
 */
@Injectable()
export class PokemonLoader {
  private cache: Map<number, Pokemon> = new Map();
  private queue: Set<number> = new Set();
  private processing = false;

  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  /**
   * Carga un Pokémon por ID, utilizando batch loading.
   * Si el ID ya está en cache, lo retorna inmediatamente.
   * Si no, lo agrega a la cola para procesamiento batch.
   */
  async load(id: number): Promise<Pokemon> {
    // Si ya está en cache, retornar inmediatamente
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Agregar a la cola
    this.queue.add(id);

    // Procesar la cola si no está en proceso
    if (!this.processing) {
      await this.processBatch();
    }

    // Retornar del cache (ya debe estar ahí después de processBatch)
    const pokemon = this.cache.get(id);
    if (!pokemon) {
      throw new Error(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  /**
   * Carga múltiples Pokémon por IDs en una sola query.
   */
  async loadMany(ids: number[]): Promise<Pokemon[]> {
    return Promise.all(ids.map((id) => this.load(id)));
  }

  /**
   * Procesa todos los IDs en la cola en una sola query a la base de datos.
   */
  private async processBatch(): Promise<void> {
    if (this.queue.size === 0) {
      return;
    }

    this.processing = true;
    const ids = Array.from(this.queue);
    this.queue.clear();

    try {
      const pokemons = await this.pokemonRepository.findManyByIds(ids);
      pokemons.forEach((pokemon) => {
        this.cache.set(pokemon.id, pokemon);
      });
    } catch (error) {
      console.error('Error loading pokemons in batch:', error);
      throw error;
    } finally {
      this.processing = false;
    }
  }

  /**
   * Limpia el cache del loader. Útil para tests o cuando necesitas recargar datos.
   */
  public clearCache(): void {
    this.cache.clear();
    this.queue.clear();
  }
}
