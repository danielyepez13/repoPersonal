import { Injectable } from '@nestjs/common';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { SearchAbilitiesQuery } from '../queries/search-abilities.query';
import type { AbilityWithPokemons } from '@/domain/pokemon/entities/ability-with-pokemons.entity';

@Injectable()
export class SearchAbilitiesHandler {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async execute(input: SearchAbilitiesQuery): Promise<AbilityWithPokemons[]> {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const offset = (page - 1) * limit;

    return this.pokemonRepository.searchAbilities(input.query, limit, offset);
  }
}
