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

interface PokeApiPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: { front_default: string };
  types: PokeApiType[];
  abilities: PokeApiAbility[];
  stats: PokeApiStat[];
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

      return this.mapApiDataToPokemon(apiData);
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

  private mapApiDataToPokemon(apiData: PokeApiPokemon): PokemonWithRelations {
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
}
