import { Injectable, Inject } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import type { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';

/**
 * Factory para crear instancias de loaders.
 * Cada request GraphQL obtiene su propia instancia de loaders para evitar compartir cache.
 */
@Injectable()
export class LoadersFactory {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  /**
   * Crea un loader que agrupa y cachea búsquedas de Pokémon por ID.
   * Soluciona el problema N+1 en GraphQL.
   */
  createPokemonBatchLoader(): (ids: number[]) => Promise<(Pokemon | Error)[]> {
    return async (ids: number[]) => {
      try {
        const pokemons = await this.pokemonRepository.findManyByIds(ids);

        // Mapear resultados manteniendo el orden de los IDs
        return ids.map(
          (id) =>
            pokemons.find((p) => p.id === id) ||
            new Error(`Pokemon with id ${id} not found`),
        );
      } catch (error) {
        return ids.map(() =>
          error instanceof Error ? error : new Error(String(error)),
        );
      }
    };
  }
}
