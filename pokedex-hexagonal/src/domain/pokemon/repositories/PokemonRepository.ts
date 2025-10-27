import { Pokemon } from '$domain/pokemon/entities/Pokemon';
import { PokemonId } from '$domain/pokemon/value-objects/PokemonId';
import { PokemonName } from '$domain/pokemon/value-objects/PokemonName';

/**
 * Contrato para el repositorio de Pokémon.
 * Define las operaciones que cualquier implementación debe soportar.
 */
export interface PokemonRepository {
  /**
   * Busca un Pokémon por su ID.
   * @param id ID del Pokémon
   * @returns Promise que resuelve al Pokémon encontrado o null si no existe
   */
  findById(id: PokemonId): Promise<Pokemon | null>;

  /**
   * Busca un Pokémon por su nombre.
   * @param name Nombre del Pokémon
   * @returns Promise que resuelve al Pokémon encontrado o null si no existe
   */
  findByName(name: PokemonName): Promise<Pokemon | null>;
}
