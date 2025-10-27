import { Injectable, Inject } from '@nestjs/common';
import { SearchPokemonsQuery } from '@/application/pokemon/queries/search-pokemons.query';
import type { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';

@Injectable()
export class SearchPokemonsHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  async execute(query: SearchPokemonsQuery): Promise<Pokemon[]> {
    return await this.pokemonRepository.searchByName(
      query.query,
      query.limit || 10,
      query.offset || 0,
    );
  }
}
