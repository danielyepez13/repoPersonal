import { Injectable, Inject } from '@nestjs/common';
import { GetPokemonByNameQuery } from '@/application/pokemon/queries/get-pokemon-by-name.query';
import type { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { PokeApiService } from '@/infrastructure/pokeapi/pokeapi.service';

@Injectable()
export class GetPokemonByNameHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async execute(query: GetPokemonByNameQuery): Promise<Pokemon | null> {
    // Buscar en la base de datos primero
    const existingPokemon = await this.pokemonRepository.findByName(query.name);

    // Si existe y tiene relaciones completas, retornarlo
    if (
      existingPokemon &&
      existingPokemon.types &&
      existingPokemon.types.length > 0 &&
      existingPokemon.abilities &&
      existingPokemon.abilities.length > 0 &&
      existingPokemon.stats &&
      existingPokemon.stats.length > 0
    ) {
      return existingPokemon;
    }

    // Si existe pero tiene relaciones incompletas, buscar en la PokeAPI y actualizar
    if (existingPokemon) {
      try {
        const apiPokemon = await this.pokeApiService.fetchPokemon(
          existingPokemon.pokedexNumber,
        );
        return this.pokemonRepository.save(apiPokemon);
      } catch {
        // Si falla la búsqueda en la API, retornar lo que existe
        return existingPokemon;
      }
    }

    // Si no existe en la BD, buscar en la PokeAPI
    try {
      const apiPokemon = await this.pokeApiService.fetchPokemonByName(
        query.name,
      );
      return this.pokemonRepository.save(apiPokemon);
    } catch {
      return null;
    }
  }
}
