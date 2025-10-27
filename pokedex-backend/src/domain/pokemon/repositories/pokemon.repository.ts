import { Pokemon } from '../entities/pokemon.entity';

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
}
