import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import { PokemonMapper } from '../mappers/pokemon.mapper';

/**
 * Class containing helper functions for working with Prisma Pokemon repository.
 */
export class PrismaPokemonHelpers {
  /**
   * Returns the include object for Pokemon with all its relations.
   */
  static getPokemonInclude() {
    return {
      types: { include: { type: true } },
      abilities: { include: { ability: true } },
      stats: { include: { stat: true } },
      moves: { include: { move: { include: { type: true } } } },
    };
  }

  /**
   * Returns the include object for Pokemon without moves (for list views).
   * Includes only types and abilities for faster loading.
   */
  static getPokemonIncludeWithoutMoves() {
    return {
      types: { include: { type: true } },
      abilities: { include: { ability: true } },
      stats: { include: { stat: true } },
    };
  }

  static async findPokemonSafe<T>(
    /**
     * Function that returns a Promise of a Pokemon entity.
     */
    query: () => Promise<T>,
    /**
     * Context for error messages.
     */
    context: string,
  ): Promise<Pokemon | null> {
    try {
      const pokemon = await query();
      return pokemon ? PokemonMapper.toDomain(pokemon) : null;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Unknown error ${context}`;
      throw new Error(message);
    }
  }

  static async findPokemonsSafe(
    /**
     * Function that returns a Promise of an array of Pokemon entities.
     */
    query: () => Promise<any[]>,
    /**
     * Context for error messages.
     */
    context: string,
  ): Promise<Pokemon[]> {
    try {
      const pokemons = await query();
      return PokemonMapper.toDomainArray(pokemons);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Unknown error ${context}`;
      throw new Error(message);
    }
  }

  static async getOrCreateRecord<T extends { id: number }>(
    /**
     * Function that returns a Promise of a Pokemon entity.
     */
    find: () => Promise<T | null>,
    /**
     * Function that returns a Promise of a Pokemon entity.
     */
    create: () => Promise<T>,
  ): Promise<T> {
    let record = await find();

    if (!record) {
      try {
        record = await create();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message.includes('Unique constraint failed')
        ) {
          record = await find();
          if (!record) throw error;
        } else {
          throw error;
        }
      }
    }

    return record;
  }

  static mapPokemonsFromRelations(pokemons: any[]): Pokemon[] {
    return pokemons
      .map((p) => {
        try {
          return PokemonMapper.toDomain(p);
        } catch (error) {
          console.error(error);
          return null;
        }
      })
      .filter((p): p is Pokemon => p !== null);
  }

  static async searchWithPokemons<T>(
    /**
     * Function that returns a Promise of an array of Pokemon entities.
     */
    query: () => Promise<T[]>,
    /**
     * Function that returns a Promise of a Pokemon entity.
     */
    mapper: (item: T) => any,
    /**
     * Context for error messages.
     */
    context: string,
  ): Promise<any[]> {
    try {
      const items = await query();
      return items.map(mapper);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : `Unknown error ${context}`;
      throw new Error(message);
    }
  }
}
