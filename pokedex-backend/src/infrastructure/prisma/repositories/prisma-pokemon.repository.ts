import { Injectable } from '@nestjs/common';
import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { PrismaService } from '../prisma.service';
import { PokemonMapper } from '../mappers/pokemon.mapper';
import { PrismaPokemonHelpers } from './prisma-pokemon.helpers';
import type { PokemonWithRelations as ApiPokemonWithRelations } from '@/infrastructure/pokeapi/pokeapi.service';

@Injectable()
export class PrismaPokemonRepository implements PokemonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Pokemon | null> {
    return await PrismaPokemonHelpers.findPokemonSafe(
      () =>
        this.prisma.pokemon.findUnique({
          where: { pokedexNumber: id },
          include: PrismaPokemonHelpers.getPokemonInclude(),
        }),
      'finding Pokemon',
    );
  }

  async findManyByIds(ids: number[]): Promise<Pokemon[]> {
    return await PrismaPokemonHelpers.findPokemonsSafe(
      () =>
        this.prisma.pokemon.findMany({
          where: { pokedexNumber: { in: ids } },
          orderBy: { pokedexNumber: 'asc' },
          include: PrismaPokemonHelpers.getPokemonInclude(),
        }),
      'finding Pokemons with ids',
    );
  }

  async findByName(name: string): Promise<Pokemon | null> {
    return await PrismaPokemonHelpers.findPokemonSafe(
      () =>
        this.prisma.pokemon.findFirst({
          where: { name: { equals: name, mode: 'insensitive' } },
          include: PrismaPokemonHelpers.getPokemonInclude(),
        }),
      'finding Pokemon by name',
    );
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
        include: PrismaPokemonHelpers.getPokemonInclude(),
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
    await this.prisma.pokemonType.deleteMany({ where: { pokemonId } });

    for (const type of types) {
      const typeRecord = await PrismaPokemonHelpers.getOrCreateRecord(
        () => this.prisma.type.findUnique({ where: { name: type.name } }),
        () => this.prisma.type.create({ data: { name: type.name } }),
      );

      await this.prisma.pokemonType.create({
        data: { pokemonId, typeId: typeRecord.id, slot: type.slot },
      });
    }
  }

  private async saveAbilities(
    pokemonId: number,
    abilities: Array<{ name: string; slot: number; isHidden: boolean }>,
  ): Promise<void> {
    await this.prisma.pokemonAbility.deleteMany({ where: { pokemonId } });

    for (const ability of abilities) {
      const abilityRecord = await PrismaPokemonHelpers.getOrCreateRecord(
        () => this.prisma.ability.findUnique({ where: { name: ability.name } }),
        () => this.prisma.ability.create({ data: { name: ability.name } }),
      );

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
    await this.prisma.pokemonStat.deleteMany({ where: { pokemonId } });

    for (const stat of stats) {
      const statRecord = await PrismaPokemonHelpers.getOrCreateRecord(
        () => this.prisma.stat.findUnique({ where: { name: stat.name } }),
        () =>
          this.prisma.stat.create({
            data: { name: stat.name, sortOrder: 0 },
          }),
      );

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
    return await PrismaPokemonHelpers.findPokemonsSafe(
      () =>
        this.prisma.pokemon.findMany({
          where: { name: { contains: query, mode: 'insensitive' } },
          orderBy: { pokedexNumber: 'asc' },
          take: limit,
          skip: offset,
          include: PrismaPokemonHelpers.getPokemonInclude(),
        }),
      'searching Pokemons by name',
    );
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
    await this.prisma.pokemonMove.deleteMany({ where: { pokemonId } });

    for (const move of moves) {
      const typeRecord = await PrismaPokemonHelpers.getOrCreateRecord(
        () => this.prisma.type.findUnique({ where: { name: move.type.name } }),
        () => this.prisma.type.create({ data: { name: move.type.name } }),
      );

      const moveRecord = await PrismaPokemonHelpers.getOrCreateRecord(
        () => this.prisma.move.findUnique({ where: { name: move.name } }),
        () =>
          this.prisma.move.create({
            data: {
              name: move.name,
              power: move.power ?? undefined,
              pp: move.pp ?? undefined,
              priority: move.priority ?? undefined,
              accuracy: move.accuracy ?? undefined,
              typeId: typeRecord.id,
            },
          }),
      );

      await this.prisma.pokemonMove.create({
        data: { pokemonId, moveId: moveRecord.id },
      });
    }
  }

  async searchMoves(
    query: string,
    limit: number,
    offset: number,
  ): Promise<any[]> {
    return await PrismaPokemonHelpers.searchWithPokemons(
      () =>
        this.prisma.move.findMany({
          where: {
            name: { contains: query.toLowerCase(), mode: 'insensitive' },
          },
          include: {
            type: true,
            pokemonMoves: {
              include: {
                pokemon: { include: PrismaPokemonHelpers.getPokemonInclude() },
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { name: 'asc' },
        }),
      (move) => ({
        id: move.id,
        name: move.name,
        power: move.power ?? undefined,
        pp: move.pp ?? undefined,
        priority: move.priority ?? undefined,
        accuracy: move.accuracy ?? undefined,
        type: { id: move.type.id, name: move.type.name },
        pokemons: PrismaPokemonHelpers.mapPokemonsFromRelations(
          move.pokemonMoves.map((pm) => pm.pokemon),
        ),
      }),
      'searching moves',
    );
  }

  async searchTypes(
    query: string,
    limit: number,
    offset: number,
  ): Promise<any[]> {
    return await PrismaPokemonHelpers.searchWithPokemons(
      () =>
        this.prisma.type.findMany({
          where: {
            name: { contains: query.toLowerCase(), mode: 'insensitive' },
          },
          include: {
            pokemons: {
              include: {
                pokemon: { include: PrismaPokemonHelpers.getPokemonInclude() },
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { name: 'asc' },
        }),
      (type) => ({
        id: type.id,
        name: type.name,
        pokemons: PrismaPokemonHelpers.mapPokemonsFromRelations(
          type.pokemons.map((pt) => pt.pokemon),
        ),
      }),
      'searching types',
    );
  }

  async searchAbilities(
    query: string,
    limit: number,
    offset: number,
  ): Promise<any[]> {
    return await PrismaPokemonHelpers.searchWithPokemons(
      () =>
        this.prisma.ability.findMany({
          where: {
            name: { contains: query.toLowerCase(), mode: 'insensitive' },
          },
          include: {
            pokemonAbilities: {
              include: {
                pokemon: { include: PrismaPokemonHelpers.getPokemonInclude() },
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: { name: 'asc' },
        }),
      (ability) => ({
        id: ability.id,
        name: ability.name,
        description: ability.description,
        pokemons: PrismaPokemonHelpers.mapPokemonsFromRelations(
          ability.pokemonAbilities.map((pa) => pa.pokemon),
        ),
      }),
      'searching abilities',
    );
  }

  async findNatureById(id: number): Promise<any> {
    try {
      return await this.prisma.nature.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding nature ${id}:`, error);
      return null;
    }
  }

  async saveNature(nature: any): Promise<any> {
    try {
      return await this.prisma.nature.upsert({
        where: { id: nature.id },
        update: nature,
        create: nature,
      });
    } catch (error) {
      console.error(`Error saving nature ${nature.id}:`, error);
      throw error;
    }
  }

  async findItemById(id: number): Promise<any> {
    try {
      return await this.prisma.item.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error finding item ${id}:`, error);
      return null;
    }
  }

  async saveItem(item: any): Promise<any> {
    try {
      return await this.prisma.item.upsert({
        where: { id: item.id },
        update: item,
        create: item,
      });
    } catch (error) {
      console.error(`Error saving item ${item.id}:`, error);
      throw error;
    }
  }

  async createTeam(data: any): Promise<any> {
    try {
      const team = await this.prisma.team.create({
        data: {
          ownerId: data.ownerId,
          name: data.name,
        },
      });

      // Crear relaciones TeamPokemon
      for (const pokemon of data.pokemons) {
        await this.prisma.teamPokemon.create({
          data: {
            teamId: team.id,
            pokemonId: pokemon.pokemonId,
            slot: pokemon.slot,
            nickname: pokemon.nickname,
            level: pokemon.level || 100,
            natureId: pokemon.natureId,
            itemId: pokemon.itemId,
          },
        });
      }

      return await this.getTeamById(team.id);
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  }

  async getTeamById(teamId: number): Promise<any> {
    try {
      return await this.prisma.team.findUnique({
        where: { id: teamId },
        include: {
          pokemons: {
            include: {
              pokemon: {
                include: {
                  types: { include: { type: true } },
                  abilities: { include: { ability: true } },
                  stats: { include: { stat: true } },
                  moves: { include: { move: { include: { type: true } } } },
                },
              },
              nature: true,
              item: true,
            },
            orderBy: { slot: 'asc' },
          },
        },
      });
    } catch (error) {
      console.error(`Error getting team ${teamId}:`, error);
      return null;
    }
  }

  async updateTeam(teamId: number, data: any): Promise<any> {
    try {
      // Actualizar nombre del equipo si se proporciona
      if (data.name) {
        await this.prisma.team.update({
          where: { id: teamId },
          data: { name: data.name },
        });
      }

      // Si se proporcionan Pokémon, actualizar relaciones
      if (data.pokemons && data.pokemons.length > 0) {
        // Eliminar Pokémon existentes
        await this.prisma.teamPokemon.deleteMany({
          where: { teamId },
        });

        // Crear nuevas relaciones
        for (const pokemon of data.pokemons) {
          await this.prisma.teamPokemon.create({
            data: {
              teamId,
              pokemonId: pokemon.pokemonId,
              slot: pokemon.slot,
              nickname: pokemon.nickname,
              level: pokemon.level || 100,
              natureId: pokemon.natureId,
              itemId: pokemon.itemId,
            },
          });
        }
      }

      return await this.getTeamById(teamId);
    } catch (error) {
      console.error(`Error updating team ${teamId}:`, error);
      throw error;
    }
  }

  async deleteTeam(teamId: number): Promise<void> {
    try {
      // Eliminar Pokémon del equipo
      await this.prisma.teamPokemon.deleteMany({
        where: { teamId },
      });

      // Eliminar equipo
      await this.prisma.team.delete({
        where: { id: teamId },
      });
    } catch (error) {
      console.error(`Error deleting team ${teamId}:`, error);
      throw error;
    }
  }

  async listTeams(limit: number, offset: number): Promise<any[]> {
    try {
      return await this.prisma.team.findMany({
        include: {
          pokemons: {
            include: {
              pokemon: {
                include: {
                  types: { include: { type: true } },
                  abilities: { include: { ability: true } },
                  stats: { include: { stat: true } },
                  moves: { include: { move: { include: { type: true } } } },
                },
              },
              nature: true,
              item: true,
            },
            orderBy: { slot: 'asc' },
          },
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error listing teams:', error);
      throw error;
    }
  }
}
