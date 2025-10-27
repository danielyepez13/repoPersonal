import { Injectable, Inject } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { ListTeamsQuery } from '../queries/list-teams.query';

/**
 * Handler para listar todos los equipos con paginación.
 */
@Injectable()
export class ListTeamsHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  async execute(input: ListTeamsQuery): Promise<any> {
    const offset = (input.page - 1) * input.limit;
    return await this.pokemonRepository.listTeams(input.limit, offset);
  }
}
