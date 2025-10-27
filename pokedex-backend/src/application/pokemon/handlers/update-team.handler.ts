import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { UpdateTeamQuery } from '../queries/update-team.query';
import { NatureItemService } from '@/infrastructure/services/nature-item.service';

/**
 * Handler para actualizar un equipo de Pokémon existente.
 * Valida que el equipo tenga máximo 6 Pokémon.
 */
@Injectable()
export class UpdateTeamHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
    private readonly natureItemService: NatureItemService,
  ) {}

  async execute(input: UpdateTeamQuery): Promise<any> {
    // Verificar que el equipo existe
    const existingTeam = await this.pokemonRepository.getTeamById(input.teamId);
    if (!existingTeam) {
      throw new NotFoundException(`Equipo ${input.teamId} no encontrado`);
    }

    // Si se proporcionan Pokémon, validar
    if (input.pokemons && input.pokemons.length > 0) {
      // Validar máximo 6 Pokémon
      if (input.pokemons.length > 6) {
        throw new BadRequestException('Un equipo puede tener máximo 6 Pokémon');
      }

      // Validar slots únicos (1-6)
      const slots = input.pokemons.map((p) => p.slot);
      if (new Set(slots).size !== slots.length) {
        throw new BadRequestException('Los slots deben ser únicos');
      }

      if (slots.some((s) => s < 1 || s > 6)) {
        throw new BadRequestException('Los slots deben estar entre 1 y 6');
      }

      // Obtener todos los Pokémon para validar sus relaciones
      const pokemonIds = input.pokemons.map((p) => p.pokemonId);
      const pokemons = await this.pokemonRepository.findManyByIds(pokemonIds);

      // Validar que cada Pokémon tenga exactamente 1 habilidad, 1 objeto, 1 naturaleza y 4 movimientos
      for (const pokemon of pokemons) {
        const teamPokemon = input.pokemons.find(
          (p) => p.pokemonId === pokemon.id,
        );

        // Validar habilidades
        if (!pokemon.abilities || pokemon.abilities.length === 0) {
          throw new BadRequestException(
            `El Pokémon ${pokemon.name} no tiene habilidades registradas`,
          );
        }

        // Validar movimientos (mínimo 4)
        if (!pokemon.moves || pokemon.moves.length === 0) {
          throw new BadRequestException(
            `El Pokémon ${pokemon.name} no tiene movimientos registrados`,
          );
        }

        if (pokemon.moves.length < 4) {
          throw new BadRequestException(
            `El Pokémon ${pokemon.name} debe tener al menos 4 movimientos (tiene ${pokemon.moves.length})`,
          );
        }

        // Validar naturaleza (requerida)
        if (!teamPokemon?.natureId) {
          throw new BadRequestException(
            `El Pokémon ${pokemon.name} debe tener una naturaleza asignada`,
          );
        }

        // Validar objeto (requerido)
        if (!teamPokemon?.itemId) {
          throw new BadRequestException(
            `El Pokémon ${pokemon.name} debe tener un objeto asignado`,
          );
        }
      }

      // Precargar naturalezas e items
      const natureIds = input.pokemons
        .map((p) => p.natureId)
        .filter((id): id is number => id !== undefined);
      const itemIds = input.pokemons
        .map((p) => p.itemId)
        .filter((id): id is number => id !== undefined);

      if (natureIds.length > 0) {
        await this.natureItemService.getNatures(natureIds);
      }
      if (itemIds.length > 0) {
        await this.natureItemService.getItems(itemIds);
      }
    }

    // Actualizar equipo
    return await this.pokemonRepository.updateTeam(input.teamId, {
      name: input.name,
      pokemons: input.pokemons,
    });
  }
}
