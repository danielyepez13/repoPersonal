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

export interface PokeApiPokemonData {
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
    id: number;
    pokeApiId: number;
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
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // ms

  async fetchPokemon(id: number): Promise<PokeApiPokemonData> {
    return this.fetchPokemonData(`${this.baseUrl}/pokemon/${id}`, `id ${id}`);
  }

  async fetchPokemonByName(name: string): Promise<PokeApiPokemonData> {
    return this.fetchPokemonData(
      `${this.baseUrl}/pokemon/${name}`,
      `name ${name}`,
    );
  }

  private async fetchPokemonData(
    url: string,
    identifier: string,
  ): Promise<PokeApiPokemonData> {
    return this.fetchWithRetry(url, identifier, 0);
  }

  private async fetchWithRetry(
    url: string,
    identifier: string,
    attempt: number,
  ): Promise<PokeApiPokemonData> {
    try {
      const response: AxiosResponse<PokeApiPokemon> =
        await axios.get<PokeApiPokemon>(url, {
          timeout: 10000, // 10 segundos timeout
        });
      const apiData: PokeApiPokemon = response.data;

      return await this.mapApiDataToPokemon(apiData);
    } catch (error: unknown) {
      const isRetryableError =
        error instanceof Error &&
        (error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('socket hang up'));

      if (isRetryableError && attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt); // Backoff exponencial
        console.warn(
          `Reintentando obtener Pokemon ${identifier} (intento ${attempt + 1}/${this.maxRetries}) en ${delay}ms`,
        );
        await this.sleep(delay);
        return this.fetchWithRetry(url, identifier, attempt + 1);
      }

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

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async mapApiDataToPokemon(
    apiData: PokeApiPokemon,
  ): Promise<PokeApiPokemonData> {
    const pokemon = new Pokemon({
      id: apiData.id,
      pokedexNumber: apiData.id,
      name: apiData.name,
      height: apiData.height,
      weight: apiData.weight,
      spriteUrl: apiData.sprites.front_default,
      createdAt: new Date(),
    }) as PokeApiPokemonData;

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
      id: number;
      pokeApiId: number;
      name: string;
      power?: number;
      pp?: number;
      priority?: number;
      accuracy?: number;
      category?: string;
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
        id: 0,
        pokeApiId: 0,
        name: move.move.name,
        category: 'status',
        type: { name: 'normal' }, // Valor por defecto si falla la llamada
      })),
    );

    const moveDetails = await Promise.all(moveDetailsPromises);

    return moveDetails.map((move) => ({
      ...move,
      id: move.pokeApiId || move.id || 0,
    }));
  }

  async fetchMoveDetails(moveName: string): Promise<{
    id: number;
    pokeApiId: number;
    name: string;
    power?: number;
    pp?: number;
    priority?: number;
    accuracy?: number;
    category?: string;
    type: { name: string };
  }> {
    return this.fetchMoveDetailsWithRetry(moveName, 0);
  }

  private async fetchMoveDetailsWithRetry(
    moveName: string,
    attempt: number,
  ): Promise<{
    id: number;
    pokeApiId: number;
    name: string;
    power?: number;
    pp?: number;
    priority?: number;
    accuracy?: number;
    category?: string;
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
        damage_class: { name: string; url: string };
      }> = await axios.get(`${this.baseUrl}/move/${moveName}`, {
        timeout: 10000,
      });

      const moveData = response.data;

      return {
        id: moveData.id,
        pokeApiId: moveData.id,
        name: moveData.name,
        power: moveData.power ?? undefined,
        pp: moveData.pp ?? undefined,
        priority: moveData.priority ?? undefined,
        accuracy: moveData.accuracy ?? undefined,
        category: moveData.damage_class?.name ?? 'status',
        type: { name: moveData.type.name },
      };
    } catch (error: unknown) {
      const isRetryableError =
        error instanceof Error &&
        (error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('socket hang up'));

      if (isRetryableError && attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt);
        console.warn(
          `Reintentando obtener movimiento ${moveName} (intento ${attempt + 1}/${this.maxRetries}) en ${delay}ms`,
        );
        await this.sleep(delay);
        return this.fetchMoveDetailsWithRetry(moveName, attempt + 1);
      }

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
