import { Injectable } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { SearchMovesQuery } from '../queries/search-moves.query';
import type { MoveWithPokemons } from '@/domain/pokemon/entities/move-with-pokemons.entity';

@Injectable()
export class SearchMovesHandler {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(input: SearchMovesQuery): Promise<MoveWithPokemons[]> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    return this.pokemonRepository.searchMoves(input.query, limit, offset);
  }
}
