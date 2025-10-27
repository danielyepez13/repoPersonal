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
  createTeam(data: any): Promise<any>;
  getTeamById(teamId: number): Promise<any>;
  updateTeam(teamId: number, data: any): Promise<any>;
  deleteTeam(teamId: number): Promise<void>;
  listTeams(limit: number, offset: number): Promise<any[]>;
  findNatureById(id: number): Promise<any>;
  saveNature(nature: any): Promise<any>;
  findItemById(id: number): Promise<any>;
  saveItem(item: any): Promise<any>;
}
