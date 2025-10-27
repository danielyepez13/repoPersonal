import { Injectable } from '@nestjs/common';
import { Pokemon } from '../../../domain/pokemon/entities/pokemon.entity';
import { PokemonRepository } from '../../../domain/pokemon/repositories/pokemon.repository';
import { PrismaService } from '../prisma.service';
import type { PokemonWithRelations } from '../../../infrastructure/pokeapi/pokeapi.service';

@Injectable()
export class PrismaPokemonRepository implements PokemonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Pokemon | null> {
    try {
      const pokemon = await this.prisma.pokemon.findUnique({
        where: { pokedexNumber: id },
      });

      if (!pokemon) return null;

      return new Pokemon({
        id: pokemon.id,
        pokedexNumber: pokemon.pokedexNumber,
        name: pokemon.name,
        height: pokemon.height ?? undefined,
        weight: pokemon.weight ?? undefined,
        spriteUrl: pokemon.spriteUrl ?? undefined,
        createdAt: pokemon.createdAt,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error finding Pokemon';
      throw new Error(message);
    }
  }

  async findManyByIds(ids: number[]): Promise<Pokemon[]> {
    try {
      const pokemons = await this.prisma.pokemon.findMany({
        where: { pokedexNumber: { in: ids } },
        orderBy: { pokedexNumber: 'asc' },
      });

      return pokemons.map((p) => ({
        id: p.id,
        pokedexNumber: p.pokedexNumber,
        name: p.name,
        height: p.height ?? undefined,
        weight: p.weight ?? undefined,
        spriteUrl: p.spriteUrl ?? undefined,
        createdAt: p.createdAt,
      }));
    } catch (error) {
      throw new Error(
        `Error finding Pokemons with ids ${ids.join(', ')}: ${error.message}`,
      );
    }
  }

  async save(pokemon: PokemonWithRelations): Promise<Pokemon> {
    try {
      const saved = await this.prisma.pokemon.upsert({
        where: { pokedexNumber: pokemon.pokedexNumber },
        update: {
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          spriteUrl: pokemon.spriteUrl,
        },
        create: {
          pokedexNumber: pokemon.pokedexNumber,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          spriteUrl: pokemon.spriteUrl,
        },
      });

      // Guardar tipos si existen
      if (pokemon.types && pokemon.types.length > 0) {
        await this.saveTypes(saved.id, pokemon.types);
      }

      // Guardar habilidades si existen
      if (pokemon.abilities && pokemon.abilities.length > 0) {
        await this.saveAbilities(saved.id, pokemon.abilities);
      }

      // Guardar estadísticas si existen
      if (pokemon.stats && pokemon.stats.length > 0) {
        await this.saveStats(saved.id, pokemon.stats);
      }

      return new Pokemon({
        id: saved.id,
        pokedexNumber: saved.pokedexNumber,
        name: saved.name,
        height: saved.height ?? undefined,
        weight: saved.weight ?? undefined,
        spriteUrl: saved.spriteUrl ?? undefined,
        createdAt: saved.createdAt,
      });
    } catch (error) {
      throw new Error(
        `Error saving Pokemon with id ${pokemon.pokedexNumber}: ${error.message}`,
      );
    }
  }

  private async saveTypes(
    pokemonId: number,
    types: Array<{ name: string; slot: number }>,
  ): Promise<void> {
    // Eliminar tipos existentes
    await this.prisma.pokemonType.deleteMany({
      where: { pokemonId },
    });

    // Guardar nuevos tipos
    for (const type of types) {
      // Obtener o crear el tipo
      const typeRecord = await this.prisma.type.upsert({
        where: { name: type.name },
        update: {},
        create: { name: type.name },
      });

      // Crear la relación
      await this.prisma.pokemonType.create({
        data: {
          pokemonId,
          typeId: typeRecord.id,
          slot: type.slot,
        },
      });
    }
  }

  private async saveAbilities(
    pokemonId: number,
    abilities: Array<{ name: string; slot: number; isHidden: boolean }>,
  ): Promise<void> {
    // Eliminar habilidades existentes
    await this.prisma.pokemonAbility.deleteMany({
      where: { pokemonId },
    });

    // Guardar nuevas habilidades
    for (const ability of abilities) {
      // Obtener o crear la habilidad
      const abilityRecord = await this.prisma.ability.upsert({
        where: { name: ability.name },
        update: {},
        create: { name: ability.name },
      });

      // Crear la relación
      await this.prisma.pokemonAbility.create({
        data: {
          pokemonId,
          abilityId: abilityRecord.id,
          slot: ability.slot,
          isHidden: ability.isHidden,
        },
      });
    }
  }

  private async saveStats(
    pokemonId: number,
    stats: Array<{ name: string; baseStat: number; effort: number }>,
  ): Promise<void> {
    // Eliminar estadísticas existentes
    await this.prisma.pokemonStat.deleteMany({
      where: { pokemonId },
    });

    // Guardar nuevas estadísticas
    for (const stat of stats) {
      // Obtener o crear la estadística
      const statRecord = await this.prisma.stat.upsert({
        where: { name: stat.name },
        update: {},
        create: { name: stat.name, sortOrder: 0 },
      });

      // Crear la relación
      await this.prisma.pokemonStat.create({
        data: {
          pokemonId,
          statId: statRecord.id,
          baseStat: stat.baseStat,
          effort: stat.effort,
        },
      });
    }
  }
}
