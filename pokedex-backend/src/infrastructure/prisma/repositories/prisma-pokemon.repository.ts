import { Injectable } from '@nestjs/common';
import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { PrismaService } from '../prisma.service';
import { PokemonMapper } from '../mappers/pokemon.mapper';
import type { PokemonWithRelations as ApiPokemonWithRelations } from '@/infrastructure/pokeapi/pokeapi.service';

@Injectable()
export class PrismaPokemonRepository implements PokemonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Pokemon | null> {
    try {
      const pokemon = await this.prisma.pokemon.findUnique({
        where: { pokedexNumber: id },
        include: this.getPokemonInclude(),
      });

      if (!pokemon) return null;

      return PokemonMapper.toDomain(pokemon);
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
        include: this.getPokemonInclude(),
      });

      return PokemonMapper.toDomainArray(pokemons);
    } catch (error) {
      throw new Error(
        `Error finding Pokemons with ids ${ids.join(', ')}: ${error.message}`,
      );
    }
  }

  async findByName(name: string): Promise<Pokemon | null> {
    try {
      const pokemon = await this.prisma.pokemon.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        include: this.getPokemonInclude(),
      });

      if (!pokemon) return null;

      return PokemonMapper.toDomain(pokemon);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error finding Pokemon by name';
      throw new Error(message);
    }
  }

  async save(pokemon: ApiPokemonWithRelations): Promise<Pokemon> {
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

      // Guardar movimientos si existen
      if (pokemon.moves && pokemon.moves.length > 0) {
        await this.saveMoves(saved.id, pokemon.moves);
      }

      // Obtener el Pokemon con sus relaciones guardadas
      const savedWithRelations = await this.prisma.pokemon.findUnique({
        where: { id: saved.id },
        include: this.getPokemonInclude(),
      });

      if (!savedWithRelations) {
        throw new Error('Failed to retrieve saved Pokemon');
      }

      return PokemonMapper.toDomain(savedWithRelations);
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
      // Obtener o crear el tipo de forma segura
      let typeRecord = await this.prisma.type.findUnique({
        where: { name: type.name },
      });

      if (!typeRecord) {
        try {
          typeRecord = await this.prisma.type.create({
            data: { name: type.name },
          });
        } catch (error: unknown) {
          // Si falla porque ya existe (race condition), obtenerlo
          if (
            error instanceof Error &&
            error.message.includes('Unique constraint failed')
          ) {
            typeRecord = await this.prisma.type.findUnique({
              where: { name: type.name },
            });
            if (!typeRecord) throw error;
          } else {
            throw error;
          }
        }
      }

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
      // Obtener o crear la habilidad de forma segura
      let abilityRecord = await this.prisma.ability.findUnique({
        where: { name: ability.name },
      });

      if (!abilityRecord) {
        try {
          abilityRecord = await this.prisma.ability.create({
            data: { name: ability.name },
          });
        } catch (error: unknown) {
          // Si falla porque ya existe (race condition), obtenerla
          if (
            error instanceof Error &&
            error.message.includes('Unique constraint failed')
          ) {
            abilityRecord = await this.prisma.ability.findUnique({
              where: { name: ability.name },
            });
            if (!abilityRecord) throw error;
          } else {
            throw error;
          }
        }
      }

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
      // Obtener o crear la estadística de forma segura
      let statRecord = await this.prisma.stat.findUnique({
        where: { name: stat.name },
      });

      if (!statRecord) {
        try {
          statRecord = await this.prisma.stat.create({
            data: { name: stat.name, sortOrder: 0 },
          });
        } catch (error: unknown) {
          // Si falla porque ya existe (race condition), obtenerla
          if (
            error instanceof Error &&
            error.message.includes('Unique constraint failed')
          ) {
            statRecord = await this.prisma.stat.findUnique({
              where: { name: stat.name },
            });
            if (!statRecord) throw error;
          } else {
            throw error;
          }
        }
      }

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

  async searchByName(
    query: string,
    limit: number,
    offset: number,
  ): Promise<Pokemon[]> {
    try {
      const pokemons = await this.prisma.pokemon.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        orderBy: { pokedexNumber: 'asc' },
        take: limit,
        skip: offset,
        include: this.getPokemonInclude(),
      });

      return PokemonMapper.toDomainArray(pokemons);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error searching Pokemons by name';
      throw new Error(message);
    }
  }

  private async saveMoves(
    pokemonId: number,
    moves: Array<{
      name: string;
      power?: number;
      pp?: number;
      priority?: number;
      accuracy?: number;
      type: { name: string };
    }>,
  ): Promise<void> {
    // Eliminar movimientos existentes
    await this.prisma.pokemonMove.deleteMany({
      where: { pokemonId },
    });

    // Guardar nuevos movimientos
    for (const move of moves) {
      // Obtener o crear el tipo del movimiento
      let typeRecord = await this.prisma.type.findUnique({
        where: { name: move.type.name },
      });

      if (!typeRecord) {
        try {
          typeRecord = await this.prisma.type.create({
            data: { name: move.type.name },
          });
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('Unique constraint failed')
          ) {
            typeRecord = await this.prisma.type.findUnique({
              where: { name: move.type.name },
            });
            if (!typeRecord) throw error;
          } else {
            throw error;
          }
        }
      }

      // Obtener o crear el movimiento
      let moveRecord = await this.prisma.move.findUnique({
        where: { name: move.name },
      });

      if (!moveRecord) {
        try {
          moveRecord = await this.prisma.move.create({
            data: {
              name: move.name,
              power: move.power,
              pp: move.pp,
              priority: move.priority,
              accuracy: move.accuracy,
              typeId: typeRecord.id,
            },
          });
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('Unique constraint failed')
          ) {
            moveRecord = await this.prisma.move.findUnique({
              where: { name: move.name },
            });
            if (!moveRecord) throw error;
          } else {
            throw error;
          }
        }
      }

      // Crear la relación
      await this.prisma.pokemonMove.create({
        data: {
          pokemonId,
          moveId: moveRecord.id,
        },
      });
    }
  }

  private getPokemonInclude() {
    return {
      types: {
        include: { type: true },
      },
      abilities: {
        include: { ability: true },
      },
      stats: {
        include: { stat: true },
      },
      moves: {
        include: {
          move: {
            include: { type: true },
          },
        },
      },
    };
  }
}
