import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { DeleteTeamQuery } from '../queries/delete-team.query';

/**
 * Handler para eliminar un equipo de Pokémon.
 */
@Injectable()
export class DeleteTeamHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  async execute(input: DeleteTeamQuery): Promise<{ success: boolean }> {
    // Verificar que el equipo existe
    const existingTeam = await this.pokemonRepository.getTeamById(input.teamId);
    if (!existingTeam) {
      throw new NotFoundException(`Equipo ${input.teamId} no encontrado`);
    }

    // Eliminar equipo
    await this.pokemonRepository.deleteTeam(input.teamId);

    return { success: true };
  }
}
