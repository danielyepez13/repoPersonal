import { Injectable } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { SearchTypesQuery } from '../queries/search-types.query';
import type { TypeWithPokemons } from '@/domain/pokemon/entities/type-with-pokemons.entity';

@Injectable()
export class SearchTypesHandler {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(input: SearchTypesQuery): Promise<TypeWithPokemons[]> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    return this.pokemonRepository.searchTypes(input.query, limit, offset);
  }
}
