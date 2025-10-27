import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';

interface PokeApiType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokeApiAbility {
  slot: number;
  is_hidden: boolean;
  ability: {
    name: string;
    url: string;
  };
}

interface PokeApiStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface PokeApiMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string };
  types: PokeApiType[];
  abilities: PokeApiAbility[];
  stats: PokeApiStat[];
  moves: PokeApiMove[];
}

export interface PokemonWithRelations {
  id: number;
  pokedexNumber: number;
  name: string;
  height?: number;
  weight?: number;
  spriteUrl?: string;
  createdAt?: Date;
  types?: Array<{ name: string; slot: number }>;
  abilities?: Array<{ name: string; slot: number; isHidden: boolean }>;
  stats?: Array<{ name: string; baseStat: number; effort: number }>;
  moves?: Array<{
    name: string;
    power?: number;
    pp?: number;
    priority?: number;
    accuracy?: number;
    type: { id?: number; name: string };
  }>;
}

@Injectable()
export class PokeApiService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  async fetchPokemon(id: number): Promise<PokemonWithRelations> {
    return this.fetchPokemonData(`${this.baseUrl}/pokemon/${id}`, `id ${id}`);
  }

  async fetchPokemonByName(name: string): Promise<PokemonWithRelations> {
    return this.fetchPokemonData(
      `${this.baseUrl}/pokemon/${name}`,
      `name ${name}`,
    );
  }

  private async fetchPokemonData(
    url: string,
    identifier: string,
  ): Promise<PokemonWithRelations> {
    try {
      const response: AxiosResponse<PokeApiPokemon> =
        await axios.get<PokeApiPokemon>(url);
      const apiData: PokeApiPokemon = response.data;

      return await this.mapApiDataToPokemon(apiData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error fetching Pokemon with ${identifier}: ${error.message}`,
        );
      }
      throw new Error(
        `Error fetching Pokemon with ${identifier}: ${String(error)}`,
      );
    }
  }

  private async mapApiDataToPokemon(
    apiData: PokeApiPokemon,
  ): Promise<PokemonWithRelations> {
    const pokemon = new Pokemon({
      id: apiData.id,
      pokedexNumber: apiData.id,
      name: apiData.name,
      height: apiData.height,
      weight: apiData.weight,
      spriteUrl: apiData.sprites.front_default,
      createdAt: new Date(),
    }) as PokemonWithRelations;

    pokemon.types = this.mapTypes(apiData.types);
    pokemon.abilities = this.mapAbilities(apiData.abilities);
    pokemon.stats = this.mapStats(apiData.stats);
    pokemon.moves = await this.mapMoves(apiData.moves);

    return pokemon;
  }

  private mapTypes(
    apiTypes: PokeApiType[],
  ): Array<{ name: string; slot: number }> {
    return apiTypes.map((t) => ({
      name: t.type.name,
      slot: t.slot,
    }));
  }

  private mapAbilities(
    apiAbilities: PokeApiAbility[],
  ): Array<{ name: string; slot: number; isHidden: boolean }> {
    return apiAbilities.map((a) => ({
      name: a.ability.name,
      slot: a.slot,
      isHidden: a.is_hidden,
    }));
  }

  private mapStats(
    apiStats: PokeApiStat[],
  ): Array<{ name: string; baseStat: number; effort: number }> {
    return apiStats.map((s) => ({
      name: s.stat.name,
      baseStat: s.base_stat,
      effort: s.effort,
    }));
  }

  private async mapMoves(apiMoves: PokeApiMove[]): Promise<
    Array<{
      name: string;
      power?: number;
      pp?: number;
      priority?: number;
      accuracy?: number;
      type: { name: string };
    }>
  > {
    // Obtener solo los movimientos únicos (por nombre)
    const uniqueMoveNames = new Set<string>();
    const uniqueApiMoves: PokeApiMove[] = [];

    for (const apiMove of apiMoves) {
      if (!uniqueMoveNames.has(apiMove.move.name)) {
        uniqueMoveNames.add(apiMove.move.name);
        uniqueApiMoves.push(apiMove);
      }
    }

    // Obtener detalles de los movimientos en paralelo
    const moveDetailsPromises = uniqueApiMoves.map((move) =>
      this.fetchMoveDetails(move.move.name).catch(() => ({
        name: move.move.name,
        type: { name: 'normal' }, // Valor por defecto si falla la llamada
      })),
    );

    const moveDetails = await Promise.all(moveDetailsPromises);

    return moveDetails;
  }

  async fetchMoveDetails(moveName: string): Promise<{
    name: string;
    power?: number;
    pp?: number;
    priority?: number;
    accuracy?: number;
    type: { name: string };
  }> {
    try {
      const response: AxiosResponse<{
        id: number;
        name: string;
        power: number | null;
        pp: number | null;
        priority: number;
        accuracy: number | null;
        type: { name: string; url: string };
      }> = await axios.get(`${this.baseUrl}/move/${moveName}`);

      const moveData = response.data;

      return {
        name: moveData.name,
        power: moveData.power ?? undefined,
        pp: moveData.pp ?? undefined,
        priority: moveData.priority ?? undefined,
        accuracy: moveData.accuracy ?? undefined,
        type: { name: moveData.type.name },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Error fetching move details for ${moveName}: ${error.message}`,
        );
      }
      throw new Error(
        `Error fetching move details for ${moveName}: ${String(error)}`,
      );
    }
  }
}
