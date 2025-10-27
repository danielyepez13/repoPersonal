import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { GetTeamQuery } from '../queries/get-team.query';
import { NatureItemService } from '@/infrastructure/services/nature-item.service';

/**
 * Handler para obtener un equipo de Pokémon por ID.
 * Carga todas las naturalezas e items asociados.
 */
@Injectable()
export class GetTeamHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
    private readonly natureItemService: NatureItemService,
  ) {}

  async execute(input: GetTeamQuery): Promise<any> {
    // Obtener equipo
    const team = await this.pokemonRepository.getTeamById(input.teamId);

    if (!team) {
      throw new NotFoundException(`Equipo ${input.teamId} no encontrado`);
    }

    // Precargar naturalezas e items
    const natureIds = team.pokemons
      .map((p: any) => p.natureId)
      .filter((id: number | null): id is number => id !== null);
    const itemIds = team.pokemons
      .map((p: any) => p.itemId)
      .filter((id: number | null): id is number => id !== null);

    if (natureIds.length > 0) {
      await this.natureItemService.getNatures(natureIds);
    }
    if (itemIds.length > 0) {
      await this.natureItemService.getItems(itemIds);
    }

    return team;
  }
}
