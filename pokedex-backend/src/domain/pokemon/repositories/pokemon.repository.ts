import { Pokemon } from '../entities/pokemon.entity';
import { MoveWithPokemons } from '../entities/move-with-pokemons.entity';
import { TypeWithPokemons } from '../entities/type-with-pokemons.entity';
import { AbilityWithPokemons } from '../entities/ability-with-pokemons.entity';

export interface PokemonRepository {
  findById(id: number): Promise<Pokemon | null>;
  findManyByIds(ids: number[]): Promise<Pokemon[]>;
  findByName(name: string): Promise<Pokemon | null>;
  searchByName(
    query: string,
    limit: number,
    offset: number,
  ): Promise<Pokemon[]>;
  save(pokemon: Pokemon): Promise<Pokemon>;
  searchMoves(
    query: string,
    limit: number,
    offset: number,
  ): Promise<MoveWithPokemons[]>;
  searchTypes(
    query: string,
    limit: number,
    offset: number,
  ): Promise<TypeWithPokemons[]>;
  searchAbilities(
    query: string,
    limit: number,
    offset: number,
  ): Promise<AbilityWithPokemons[]>;
}
