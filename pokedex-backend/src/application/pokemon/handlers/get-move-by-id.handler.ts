import { Injectable, Inject } from '@nestjs/common';
import { GetMoveByIdQuery } from '@/application/pokemon/queries/get-move-by-id.query';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';

@Injectable()
export class GetMoveByIdHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  async execute(query: GetMoveByIdQuery): Promise<any> {
    return await this.pokemonRepository.getMoveById(query.id);
  }
}
