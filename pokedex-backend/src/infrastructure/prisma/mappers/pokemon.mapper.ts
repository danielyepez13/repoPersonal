import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import type { Pokemon as PrismaPokemon } from '@prisma/client';

export interface PokemonWithRelations extends PrismaPokemon {
  types: Array<{
    type: { id: number; name: string };
    slot: number;
  }>;
  abilities: Array<{
    ability: { id: number; name: string };
    slot: number;
    isHidden: boolean;
  }>;
  stats: Array<{
    stat: { id: number; name: string };
    baseStat: number;
    effort: number;
  }>;
}

export class PokemonMapper {
  static toDomain(prismaPokemon: unknown): Pokemon {
    const pokemon = this.validateAndCast(prismaPokemon);
    return new Pokemon({
      id: pokemon.id,
      pokedexNumber: pokemon.pokedexNumber,
      name: pokemon.name,
      height: pokemon.height ?? undefined,
      weight: pokemon.weight ?? undefined,
      spriteUrl: pokemon.spriteUrl ?? undefined,
      createdAt: pokemon.createdAt,
      types: this.mapTypes(pokemon.types),
      abilities: this.mapAbilities(pokemon.abilities),
      stats: this.mapStats(pokemon.stats),
    });
  }

  static toDomainArray(prismaPokemonArray: unknown[]): Pokemon[] {
    return prismaPokemonArray.map((p) => this.toDomain(p));
  }

  private static validateAndCast(data: unknown): PokemonWithRelations {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid Pokemon data');
    }

    const pokemon = data as PokemonWithRelations;

    if (
      !pokemon.id ||
      !pokemon.pokedexNumber ||
      !pokemon.name ||
      !Array.isArray(pokemon.types) ||
      !Array.isArray(pokemon.abilities) ||
      !Array.isArray(pokemon.stats)
    ) {
      throw new Error('Pokemon data is missing required fields');
    }

    return pokemon;
  }

  private static mapTypes(
    types: Array<{ type: { id: number; name: string }; slot: number }>,
  ) {
    return types.length > 0
      ? types.map((pt) => ({
          id: pt.type.id,
          name: pt.type.name,
          slot: pt.slot,
        }))
      : undefined;
  }

  private static mapAbilities(
    abilities: Array<{
      ability: { id: number; name: string };
      slot: number;
      isHidden: boolean;
    }>,
  ) {
    return abilities.length > 0
      ? abilities.map((pa) => ({
          id: pa.ability.id,
          name: pa.ability.name,
          slot: pa.slot,
          isHidden: pa.isHidden,
        }))
      : undefined;
  }

  private static mapStats(
    stats: Array<{
      stat: { id: number; name: string };
      baseStat: number;
      effort: number;
    }>,
  ) {
    return stats.length > 0
      ? stats.map((ps) => ({
          id: ps.stat.id,
          name: ps.stat.name,
          baseStat: ps.baseStat,
          effort: ps.effort,
        }))
      : undefined;
  }
}
